import { useLanguage } from "../i18n";
import { Link } from "react-router-dom";

export default function Wechat() {
  const { lang, setLang, t } = useLanguage();
  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  return (
    <div className="app">
      <nav className="nav">
        <span className="nav-logo">Lusen Tao</span>
        <div className="nav-right">
          <Link to="/" className="nav-link">{lang === "zh" ? "作品" : "Work"}</Link>
          <button className="nav-lang" onClick={toggleLang}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>
            {lang === "zh" ? "EN" : "中"}
          </button>
        </div>
      </nav>

      <section className="wechat-page">
        <div className="wechat-card">
          <h1 className="wechat-title">{lang === "zh" ? "微信联系" : "WeChat Contact"}</h1>
          <div className="wechat-qr">
            <div className="wechat-qr-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="3"/>
                <path d="M8 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM7 14s1.5 2 5 2 5-2 5-2"/>
              </svg>
              <span className="wechat-qr-text">{lang === "zh" ? "微信二维码" : "WeChat QR Code"}</span>
            </div>
          </div>
          <p className="wechat-phone">
            {lang === "zh" ? "请扫描二维码添加微信 · " : "Scan the QR code to add WeChat · "}
            <strong>15875591020</strong>
          </p>
          <Link to="/" className="wechat-back">← {lang === "zh" ? "返回首页" : "Back to Home"}</Link>
        </div>
      </section>
    </div>
  );
}
