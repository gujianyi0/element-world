import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchComments, postComment, toggleLike, deleteComment } from '../lib/api';
import './CommentSection.css';

// 管理员密码的 SHA-256 哈希（不存明文）
const ADMIN_PASSWORD_HASH = 'e73a17a28343de77ae15d872d38e47689415df2effd35f20d4e9b2ced6ca67fb';

// 链接检测正则
const URL_REGEX = /https?:\/\/|www\.[a-zA-Z0-9]|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/[^\s]*/;

// 颜色池（头像背景色）
const AVATAR_COLORS = [
  '#e74c3c', '#e67e22', '#2ecc71', '#2980b9',
  '#8e44ad', '#16a085', '#d35400', '#27ae60',
  '#c0392b', '#7f8c8d', '#2c3e50', '#f39c12',
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTime(ts, lang) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (lang === 'zh') {
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 30) return `${days} 天前`;
    return d.toLocaleDateString('zh-CN');
  } else {
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return d.toLocaleDateString('en-US');
  }
}

// SHA-256 哈希（浏览器内置 API）
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function containsUrl(text) {
  return URL_REGEX.test(text);
}

function CommentSection({ elementId }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'zh';

  // 评论数据
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 输入
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 管理员
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // 恢复管理员状态 + 昵称
  useEffect(() => {
    if (sessionStorage.getItem('ew-admin') === 'true') {
      setIsAdmin(true);
    }
    const savedNick = localStorage.getItem('ew-nickname');
    if (savedNick) setNickname(savedNick);
  }, []);

  // 加载评论
  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchComments(elementId);
      setComments(data || []);
    } catch (err) {
      console.error('加载评论失败:', err);
    } finally {
      setLoading(false);
    }
  }, [elementId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // 发布评论
  const handleSubmit = async () => {
    setError('');

    const trimmedContent = content.trim();
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setError(lang === 'zh' ? '请输入昵称' : 'Please enter a nickname');
      return;
    }
    if (trimmedNickname.length > 20) {
      setError(lang === 'zh' ? '昵称不能超过20个字符' : 'Nickname cannot exceed 20 characters');
      return;
    }
    if (!trimmedContent) {
      setError(lang === 'zh' ? '请输入评论内容' : 'Please enter a comment');
      return;
    }
    if (trimmedContent.length > 1000) {
      setError(lang === 'zh' ? '评论不能超过1000个字符' : 'Comment cannot exceed 1000 characters');
      return;
    }
    if (containsUrl(trimmedContent)) {
      setError(lang === 'zh' ? '评论中不能包含网址链接' : 'Comments cannot contain URLs');
      return;
    }

    setSubmitting(true);
    try {
      await postComment(elementId, trimmedNickname, trimmedContent);
      localStorage.setItem('ew-nickname', trimmedNickname);
      setContent('');
      await loadComments();
    } catch (err) {
      setError(err.message || (lang === 'zh' ? '发布失败，请稍后重试' : 'Failed to post'));
      console.error('发布评论失败:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // 点赞/取消点赞
  const handleLike = async (comment) => {
    try {
      await toggleLike(comment.id);
      // 本地更新
      setComments(prev => prev.map(c => {
        if (c.id !== comment.id) return c;
        try {
          const likedBy = JSON.parse(c.likedBy || '[]');
          const uid = sessionStorage.getItem('ew-visitor-id') || '';
          const alreadyLiked = likedBy.includes(uid);
          const newLikedBy = alreadyLiked ? likedBy.filter(id => id !== uid) : [...likedBy, uid];
          return { ...c, likes: alreadyLiked ? Math.max(0, c.likes - 1) : c.likes + 1, likedBy: JSON.stringify(newLikedBy) };
        } catch { return c; }
      }));
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  // 管理员登录
  const handleAdminLogin = async () => {
    const hash = await sha256(adminPassword);
    if (hash === ADMIN_PASSWORD_HASH) {
      setIsAdmin(true);
      sessionStorage.setItem('ew-admin', 'true');
      setShowAdminInput(false);
      setAdminPassword('');
    } else {
      setError(lang === 'zh' ? '密码错误' : 'Incorrect password');
      setAdminPassword('');
    }
  };

  // 退出管理员
  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('ew-admin');
  };

  // 删除评论
  const handleDelete = async (comment) => {
    if (!isAdmin) return;
    if (!window.confirm(lang === 'zh' ? '确定删除这条评论？' : 'Delete this comment?')) return;

    // 弹出输入密码确认（Worker 端会二次校验）
    const password = prompt(lang === 'zh' ? '请输入管理员密码确认删除：' : 'Enter admin password to confirm deletion:');
    if (!password) return;

    try {
      await deleteComment(comment.id, password);
      setComments(prev => prev.filter(c => c.id !== comment.id));
    } catch (err) {
      alert(err.message || (lang === 'zh' ? '删除失败' : 'Delete failed'));
    }
  };

  return (
    <div className="comment-section">
      {/* 标题栏 */}
      <div className="comment-header">
        <span className="comment-title">
          💬 {t('comments.title')}
          <span className="comment-count">({comments.length})</span>
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin ? (
            <button className="admin-btn active" onClick={handleAdminLogout}>
              🔓 {t('comments.exitAdmin')}
            </button>
          ) : showAdminInput ? (
            <>
              <input
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                placeholder={lang === 'zh' ? '管理员密码' : 'Admin password'}
                style={{ padding: '4px 10px', fontSize: '0.82rem', border: '1px solid var(--border)', borderRadius: 14, width: 120 }}
              />
              <button className="admin-btn" onClick={handleAdminLogin}>
                ✓
              </button>
              <button className="admin-btn" onClick={() => { setShowAdminInput(false); setAdminPassword(''); }}>
                ✕
              </button>
            </>
          ) : (
            <button className="admin-btn" onClick={() => setShowAdminInput(true)}>
              🔒 {t('comments.adminMode')}
            </button>
          )}
        </div>
      </div>

      {/* 评论列表 */}
      <div className="comment-list-area">
        {loading ? (
          <div className="comment-loading">⏳ {lang === 'zh' ? '加载评论中...' : 'Loading comments...'}</div>
        ) : comments.length === 0 ? (
          <div className="comment-empty">
            💭 {lang === 'zh' ? '还没有评论，来说点什么吧！' : 'No comments yet. Be the first to comment!'}
          </div>
        ) : (
          <div className="comment-list">
            {comments.map(comment => {
              let likedBy = [];
              try { likedBy = JSON.parse(comment.likedBy || '[]'); } catch {}
              const visitorId = sessionStorage.getItem('ew-visitor-id') || '';
              const liked = likedBy.includes(visitorId);

              return (
                <div key={comment.id} className="comment-item">
                  <div
                    className="comment-avatar"
                    style={{ background: getAvatarColor(comment.nickname) }}
                  >
                    {(comment.nickname || '?')[0].toUpperCase()}
                  </div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <span className="comment-nickname">{comment.nickname}</span>
                      <span className="comment-time">{formatTime(comment.createdAt, lang)}</span>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                    <div className="comment-actions">
                      <button
                        className={`like-btn ${liked ? 'liked' : ''}`}
                        onClick={() => handleLike(comment)}
                      >
                        {liked ? '❤️' : '🤍'} {comment.likes || 0}
                      </button>
                      {isAdmin && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(comment)}
                        >
                          🗑 {t('comments.delete')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 输入区 - 吸附底部 */}
      <div className="comment-input-area">
        <div className="comment-input-row">
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder={t('comments.nicknamePlaceholder')}
            maxLength={20}
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t('comments.contentPlaceholder')}
            maxLength={1000}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
            }}
          />
        </div>
        <div className="comment-submit-row">
          {error && <span className="comment-error">{error}</span>}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
            {content.length}/1000
          </span>
          <button
            className="comment-submit-btn"
            onClick={handleSubmit}
            disabled={submitting || !content.trim() || !nickname.trim()}
          >
            {submitting ? (lang === 'zh' ? '发布中...' : 'Posting...') : t('comments.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
