import React, { useState, useEffect } from "react";
import "./Components.css";
import { FaRegFolderOpen } from "react-icons/fa6";
import Img from "../assets/image.png";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import api from "../axios";

function Statistika() {
  const { t } = useLanguage();

  const [isAdmin, setIsAdmin] = useState(false);
  const [apiData, setApiData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Admin holatini tekshirish
  useEffect(() => {
    const checkAdmin = () => {
      const status = localStorage.getItem("isAdmin");
      setIsAdmin(status === "true");
    };
    checkAdmin();
    const interval = setInterval(checkAdmin, 500);
    return () => clearInterval(interval);
  }, []);

  // Sonni qisqartirish funksiyasi (Result.jsx dan olingan)
  const formatNumber = (num) => {
    if (!num) return "0";
    const absNum = Math.abs(num);
    if (absNum >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " mlrd";
    }
    if (absNum >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + " mln";
    }
    if (absNum >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + " ming";
    }
    return num.toString();
  };

  // API dan statistika yuklash
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/statistics/global/");
        setApiData(response.data); // to'g'ridan-to'g'ri obyekt
      } catch (error) {
        console.error("Statistika yuklashda xatolik:", error);
        setApiData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // TO'G'RI kartalar konfiguratsiyasi
  const statCards = [
    { key: "land", apiKey: "land", color: "#00d097", translation: "total_area" }, // hudud
    { key: "uz_mablagi", apiKey: "uz_mablagi", color: "#fdc748", translation: "own_funds" }, // o'z mablag'i
    { key: "credit", apiKey: "credit", color: "#15c0e6", translation: "bank_funds" }, // kredit
    { key: "export_volume_real", apiKey: "export_volume_real", color: "#6d5dd3", translation: "export" }, // eksport real
    { key: "created_positions", apiKey: "created_positions", color: "#15c0e6", translation: "projects" }, // yaratilgan ish o'rinlari
    {
      key: "export_volume",
      color: "#6d5dd3",
      translation: "экспорт ҳажми",
      isSpecial: true,
      planKey: "export_volume_planned",
      actualKey: "export_volume_real",
    },
    { key: "ozlashtirilgan_mublag", apiKey: "ozlashtirilgan_mublag", color: "#fdc748", translation: "own_funds" }, // o'zlashtirilgan
    { key: "cost", apiKey: "cost", color: "#00d097", translation: "production" }, // loyiha qiymati
  ];

  if (isLoading) {
    return (
      <div className="statistika">
        <div className="container">
          <h2 className="title">{t("statistics_title")}</h2>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Ma'lumotlar yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="statistika">
      <div className="container">
        <h2 className="title">{t("statistics_title")}</h2>

        <div className="pages">
          {/* Mavjud ish o'rinlari */}
          <div className="work">
            <div className="text">
              <h2>{formatNumber(apiData.ish_urni_real ?? 0)}</h2>
              <span>{t("vacant_jobs")}</span>
            </div>
            <div className="img">
              <img src={Img} alt="Vacant jobs" />
            </div>
          </div>

          {/* Barcha stat kartalar */}
          {statCards.map((card) => (
            <div className="page" key={card.key}>
              {card.isSpecial ? (
                // MAXSUS KART – EKSport HAJMI
                <div className="export-card">
                  <h3 className="export-title">{t(card.translation)}</h3>
                  <div className="export-values">
                    <div className="value-item">
                      <span className="badge badge-plan">{t("plan")}</span>
                      <h2 className="value-number">
                        {formatNumber(apiData[card.planKey] ?? 0)}
                      </h2>
                    </div>
                    <div className="value-item">
                      <span className="badge badge-actual">{t("actual")}</span>
                      <h2 className="value-number">
                        {formatNumber(apiData[card.actualKey] ?? 0)}
                      </h2>
                    </div>
                  </div>
                </div>
              ) : (
                // ODDIY KARTALAR
                <div className="carddd">
                  <FaRegFolderOpen color={card.color} className="icon" id="ikonka" />
                  <h2>{formatNumber(apiData[card.apiKey] ?? 0)}</h2>
                  <span>{t(card.translation)}</span>
                </div>
              )}
            </div>
          ))}

          {/* IJARA — faqat admin uchun */}
          {isAdmin && (
            <Link className="linkk" to="/uniquedit">
              <div className="ijara">
                <FaRegFolderOpen color="#6d5dd3" className="icon" />
                <h2>{t("Ижара") || "Ijara"}</h2>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistika;
