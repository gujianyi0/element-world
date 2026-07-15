// 评论 API（同域名 Pages Functions + D1，国内外均可访问）
const API_BASE = '/api';

// 生成访客唯一 ID（用于点赞去重，存 sessionStorage）
function getVisitorId() {
  let id = sessionStorage.getItem('ew-visitor-id');
  if (!id) {
    const arr = new Uint8Array(8);
    crypto.getRandomValues(arr);
    id = 'v_' + Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem('ew-visitor-id', id);
  }
  return id;
}

// GET /comments?elementId=xxx
async function fetchComments(elementId) {
  const res = await fetch(`${API_BASE}/comments?elementId=${encodeURIComponent(elementId)}`);
  if (!res.ok) throw new Error('加载评论失败');
  return res.json();
}

// POST /comments
async function postComment(elementId, nickname, content) {
  const res = await fetch(`${API_BASE}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ elementId, nickname, content }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || '发布失败');
  }
  return res.json();
}

// POST /comments/:id/like
async function toggleLike(commentId) {
  const res = await fetch(`${API_BASE}/comments/${commentId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: getVisitorId() }),
  });
  if (!res.ok) throw new Error('点赞失败');
  return res.json();
}

// DELETE /comments/:id
async function deleteComment(commentId, password) {
  const res = await fetch(`${API_BASE}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'x-admin-password': password },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || '删除失败');
  }
  return res.json();
}

export { fetchComments, postComment, toggleLike, deleteComment, getVisitorId };
