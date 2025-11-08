// src/components/Footer.jsx
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Components.css";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-overlay">
        <div className="footer-container">
          {/* 1. Contact Us */}
          <div className="footer-box">
            <h3>{t("footer_contact_title")}</h3>
            <p>
              <span>{t("footer_phone_label")} #1:</span> +998 (69) 228 84 86
            </p>
            <p>
              <span>{t("footer_phone_label")} #2:</span> +998 (93) 911 75 82
            </p>
          </div>

          {/* 2. Send a Message */}
          <div className="footer-box">
            <h3>{t("footer_message_title")}</h3>
            <p>
              <span>{t("footer_sales_dept")}:</span> info@gmail.com
            </p>
            <p>
              <span>{t("footer_support")}:</span> infosupport@gmail.com
            </p>
          </div>

          {/* 3. Main Office */}
          <div className="footer-box">
            <h3>{t("footer_office_title")}</h3>
            <p>
              <span>{t("footer_address")}:</span> {t("footer_address_text")}
            </p>
            <p>
              {t("footer_weekdays")}: <span>9:00–18:00</span> 
              {t("footer_weekends")}: <span className="closed">{t("footer_closed")}</span>
            </p>
          </div>
        </div>
      </div>
    <hr className="for_hr" />
    <div className="footer-overlay2">
        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2025 {t("footer_copyright_text")}</p>
          <p>{t("footer_follow_us")}</p>
        </div>
    </div>
    </footer>
  );
};

export default Footer;