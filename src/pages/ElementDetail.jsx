import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import ModelViewer from '../components/ModelViewer';
import { getElementById } from '../data/elements';
import { useEffect } from 'react';

function ElementDetail() {
  const { elementId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  const element = getElementById(elementId);

  // 如果找不到对应元素，返回首页
  useEffect(() => {
    if (!element) {
      navigate('/');
    }
  }, [element, navigate]);

  if (!element) {
    return null;
  }

  const name = lang === 'zh' ? element.nameZh : element.nameEn;
  // 优先使用远程R2地址，本地开发时使用本地文件
  const modelPath = element.modelUrl || (element.modelFile ? `/models/${element.modelFile}` : null);

  // 辅助函数：获取双语内容
  const getContent = (field) => {
    if (typeof element[field] === 'object' && element[field] !== null) {
      return element[field][lang] || element[field].zh;
    }
    return element[field] || '';
  };

  return (
    <div className="detail-page">
      <Header />

      <div className="detail-content">
        {/* 3D模型查看器 */}
        <ModelViewer modelPath={modelPath} />

        {/* 元素信息面板 */}
        <aside className="info-panel">
          {/* 元素名称 */}
          <div className="info-card">
            <div className="element-name-zh">
              {element.nameZh}
              <span style={{ fontSize: '1.2rem', color: element.color, marginLeft: 8 }}>
                  {element.symbol}
                </span>
            </div>
            <div className="element-name-en">{element.nameEn}</div>
            <div className="info-row">
              <span className="label">{lang === 'zh' ? '原子序数' : 'Atomic Number'}</span>
              <span className="value">{element.atomicNumber}</span>
            </div>
          </div>

          {/* 基本介绍 */}
          <div className="info-card">
            <h3>📖 {t('detail.basicInfo')}</h3>
            <p className="info-text">{getContent('basicInfo')}</p>
          </div>

          {/* 存在与作用 */}
          <div className="info-card">
            <h3>🌍 {t('detail.existence')}</h3>
            <p className="info-text">{getContent('existence')}</p>
          </div>

          {/* 性格设定 */}
          <div className="info-card">
            <h3>✨ {t('detail.personality')}</h3>
            <p className="info-text">{getContent('personality')}</p>
          </div>

          {/* 有趣小知识 */}
          <div className="info-card">
            <h3>💡 {t('detail.funFact')}</h3>
            <p className="info-text">{getContent('funFact')}</p>
          </div>

          {/* 常见存在形式 */}
          <div className="info-card">
            <h3>🔍 {t('detail.commonForm')}</h3>
            <p className="info-text">{getContent('commonForm')}</p>
          </div>

          {/* 物理性质 */}
          <div className="info-card">
            <h3>📐 {t('detail.physicalProperties')}</h3>
            <p className="info-text">{getContent('physicalProperties')}</p>
          </div>
        </aside>
      </div>

      {/* 页脚 */}
      <footer className="footer">
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  );
}

export default ElementDetail;
