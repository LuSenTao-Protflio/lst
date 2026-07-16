import { useLanguage } from "../i18n";

export default function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div className="footer-col">
          <h3 className="footer-heading">{t("footer.col1Heading")}</h3>
          <a href="mailto:sentaolu371@gmail.com" className="footer-email">{t("footer.col1Email")}</a>
        </div>
        <div className="footer-col">
          <h3 className="footer-heading">{t("footer.col2Heading")}</h3>
          <p className="footer-about">{t("footer.col2Desc")}</p>
        </div>
      </div>
    </footer>
  );
}
