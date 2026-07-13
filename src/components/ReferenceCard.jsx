import { useTranslation } from 'react-i18next';

function ReferenceCard() {
  const { t } = useTranslation();

  return (
    <section className="reference-section">
      <div className="reference-card">
        <img
          src="/images/reference/1524e355f73186d69ec89598be81d34e.jpg"
          alt="参考模型卡片 - 元素拟人化设计"
        />
        <div className="reference-info">
          <h3>📋 {t('home.referenceTitle')}</h3>
          <p>{t('home.referenceDesc')}</p>
          <p style={{ marginTop: 12, fontSize: '0.85rem', fontStyle: 'italic' }}>
            💡 {t('home.referenceTitle')}：展示每个元素的拟人化角色设定，包含基本信息、存在与作用、性格设定、有趣小知识和物理性质等内容。
            每个元素都有独特的视觉风格与人物形象，让科学变得生动有趣。
          </p>
        </div>
      </div>
    </section>
  );
}

export default ReferenceCard;
