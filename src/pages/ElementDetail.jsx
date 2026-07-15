import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import CommentSection from '../components/CommentSection';
import { getElementById } from '../data/elements';

// 手机端：纯图片展示，零 Three.js 依赖
function MobileElementView({ element, backgroundImage }) {
  return (
    <div className="model-viewer-panel">
      <div className="viewer-header">
        <span>🖼️ {element.nameZh} — {element.nameEn}</span>
      </div>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a1628',
      }}>
        {backgroundImage ? (
          <img src={backgroundImage} alt={element.nameZh}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
        ) : (
          <span style={{ fontSize: 80, opacity: 0.4 }}>🧪</span>
        )}
      </div>
    </div>
  );
}

// 电脑端：3D查看器（延迟加载，不打包进主文件）
let DesktopModelViewer = null;
function getDesktopViewer() {
  if (!DesktopModelViewer) {
    DesktopModelViewer = import('../components/ModelViewer').then(m => m.default);
  }
  return DesktopModelViewer;
}

function DesktopView({ modelPath, themeColor, backgroundImage }) {
  const [Viewer, setViewer] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getDesktopViewer().then(mod => {
      if (!cancelled) setViewer(() => mod);
    }).catch(() => {
      if (!cancelled) setViewer(() => null); // 加载失败，回退到占位
    });
    return () => { cancelled = true; };
  }, []);

  if (!Viewer) {
    return (
      <div className="model-viewer-panel" style={{ minHeight: 400, background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', opacity: 0.4 }}>加载3D查看器...</span>
      </div>
    );
  }

  return <Viewer modelPath={modelPath} themeColor={themeColor} backgroundImage={backgroundImage} />;
}

function ElementDetail() {
  const { elementId } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'zh';
  // 直接用 CSS 媒体查询控制显隐，不用 JS 监听（手机滚动时 resize 事件会崩）
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const element = getElementById(elementId);

  if (!element) {
    return (
      <div className="detail-page">
        <Header />
        <div style={{ padding: 60, textAlign: 'center' }}>
          <h2>元素未找到</h2>
          <Link to="/">← 返回首页</Link>
        </div>
      </div>
    );
  }

  const modelPath = element.modelFile ? `/models/${element.modelFile}` : null;
  const backgroundImage = (lang === 'zh' ? element.thumbnailZh : element.thumbnailEn) || element.thumbnailZh || null;

  const get = (field) => {
    try {
      const data = element?.[field];
      if (!data) return '';
      if (typeof data === 'string') return data;
      return data?.[lang] || data?.zh || '';
    } catch { return ''; }
  };

  return (
    <div className="detail-page">
      <Header />
      <div className="detail-content">
        {isMobile ? (
          <MobileElementView element={element} backgroundImage={backgroundImage} />
        ) : (
          <DesktopView modelPath={modelPath} themeColor={element.color} backgroundImage={backgroundImage} />
        )}
        <aside className="info-panel">
          <div className="info-card">
            <div className="element-name-zh">
              {element.nameZh || ''}
              <span style={{ fontSize: '1.2rem', color: element.color || '#666', marginLeft: 8 }}>{element.symbol || ''}</span>
            </div>
            <div className="element-name-en">{element.nameEn || ''}</div>
            <div className="info-row">
              <span className="label">{lang === 'zh' ? '原子序数' : 'Atomic Number'}</span>
              <span className="value">{element.atomicNumber || ''}</span>
            </div>
          </div>
          <div className="info-card"><h3>📖 {t('detail.basicInfo')}</h3><p className="info-text">{get('basicInfo')}</p></div>
          <div className="info-card"><h3>🌍 {t('detail.existence')}</h3><p className="info-text">{get('existence')}</p></div>
          <div className="info-card"><h3>✨ {t('detail.personality')}</h3><p className="info-text">{get('personality')}</p></div>
          <div className="info-card"><h3>💡 {t('detail.funFact')}</h3><p className="info-text">{get('funFact')}</p></div>
          <div className="info-card"><h3>🔍 {t('detail.commonForm')}</h3><p className="info-text">{get('commonForm')}</p></div>
          <div className="info-card"><h3>📐 {t('detail.physicalProperties')}</h3><p className="info-text">{get('physicalProperties')}</p></div>
        </aside>
      </div>

      {/* 评论区 - 宽度与详情内容对齐 */}
      <div className="comment-wrapper">
        <CommentSection elementId={element.id} />
      </div>

      <footer className="footer"><p>{t('footer.copyright')}</p></footer>
    </div>
  );
}

export default ElementDetail;
