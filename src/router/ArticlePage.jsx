// router/ArticlePage.jsx
import React from "react";
import "../components/Components.css";
import { useLanguage } from "../context/LanguageContext"; // YANGI

const ArticlePage = () => {
  const { t } = useLanguage(); // Tarjima funksiyasi

  return (
    <div className="container">
    <div className="article-container">
      <h2 className="article-title">{t("article_title")}</h2>

      <div className="article-content">
        <p>{t("article_p1")}</p>
        <p>{t("article_p2")}</p>
        <p>{t("article_p3")}</p>
        <p>{t("article_p4")}</p>
        <p>{t("article_p5")}</p>
        <p>{t("article_p6")}</p>
        <p>{t("article_p7")}</p>
        <p>{t("article_p8")}</p>
        <p>{t("article_p9")}</p>
      </div>
    </div>
    </div>
  );
};

export default ArticlePage;