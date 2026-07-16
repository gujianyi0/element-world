import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// 化学符号图标映射（无缩略图时的备选方案）
const elementIcons = {
  Cu: '🔶',
  Fe: '⚙️',
  C: '💠',
  Au: '👑',
};

function ElementCard({ element }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  const handleClick = () => {
    navigate(`/element/${element.id}`);
  };

  const name = lang === 'zh' ? element.nameZh : element.nameEn;
  const info = element?.basicInfo;
  const descText = info ? (lang === 'zh' ? info.zh : info.en) : '';
  const description = descText ? descText.slice(0, 60) + '...' : '';

  // 根据语言选择缩略图
  const thumbnail = lang === 'zh' ? element.thumbnailZh : element.thumbnailEn;

  return (
    <div className="element-card" onClick={handleClick}>
      <div
        className="card-img"
        style={{ background: `linear-gradient(135deg, ${element.color}22 0%, ${element.color}11 100%)` }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'fill' }}
          />
        ) : (
          <span className="placeholder-icon">
            {elementIcons[element.symbol] || '🧪'}
          </span>
        )}
        <span className="atomic-number">{element.atomicNumber}</span>
      </div>
      <div className="card-body">
        <h3>{name}</h3>
        <div className="card-en">{element.symbol} — {element.nameEn}</div>
        <div className="card-desc">{description}</div>
        <div style={{ marginTop: '12px', color: element.color, fontSize: '0.85rem', fontWeight: 600 }}>
          {t('home.viewDetail')}
        </div>
      </div>
    </div>
  );
}

export default ElementCard;
