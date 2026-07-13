import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('element-world-lang', lang);
  };

  const currentLang = i18n.language;

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-icon">⚛️</span>
          {t('site.title')}
        </Link>
        <div className="header-right">
          {!isHome && (
            <Link to="/" className="header-back">
              {t('nav.back')}
            </Link>
          )}
          <div className="lang-switch">
            <button
              className={currentLang === 'zh' ? 'active' : ''}
              onClick={() => switchLanguage('zh')}
            >
              中文
            </button>
            <button
              className={currentLang === 'en' ? 'active' : ''}
              onClick={() => switchLanguage('en')}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
