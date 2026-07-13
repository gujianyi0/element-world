import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import ElementCard from '../components/ElementCard';
import elements from '../data/elements';

function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />

      {/* Hero 区域 */}
      <section className="hero-section">
        <h1>{t('site.title')}</h1>
        <p className="hero-sub">
          {t('site.subtitle')} — {t('site.description')}
        </p>
      </section>

      {/* 主体内容 */}
      <main className="main">
        {/* 元素模型展示 */}
        <h2 className="section-title">{t('home.elementsTitle')}</h2>
        <p className="section-desc">{t('home.elementsDesc')}</p>

        <div className="elements-grid">
          {elements.map((element) => (
            <ElementCard key={element.id} element={element} />
          ))}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="footer">
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  );
}

export default Home;
