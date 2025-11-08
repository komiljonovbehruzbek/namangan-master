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

  // API dan statistika yuklash
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/statistics/golabal/");
        console.log("API dan kelgan statistika:", response.data);

        const aggregated = {};
        response.data.forEach((item) => {
          item.titles.forEach((title) => {
            aggregated[title] = (aggregated[title] || 0) + item.totalNum;
          });
        });

        // Maxsus eksport plan/actual qiymatlari
        response.data.forEach((item) => {
          if (item.titles.includes("export_plan")) {
            aggregated["export_plan"] = item.totalNum;
          }
          if (item.titles.includes("export_actual")) {
            aggregated["export_actual"] = item.totalNum;
          }
        });

        setApiData(aggregated);
      } catch (error) {
        console.error("Statistika yuklashda xatolik:", error);
        setApiData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Statistik kartalar konfiguratsiyasi
  const statCards = [
    { key: "small_industrial_zones", apiTitle: "small_industrial_zones", color: "#00d097", translation: "small_industrial_zones" },
    { key: "internal_capacity", apiTitle: "internal_capacity", color: "#fdc748", translation: "internal_capacity" },
    { key: "bank_funds", apiTitle: "bank_funds", color: "#15c0e6", translation: "bank_funds" },
    { key: "export_count", apiTitle: "export", color: "#6d5dd3", translation: "export" },
    { key: "total_area", apiTitle: "total_area", color: "#15c0e6", translation: "total_area" },
    {
      key: "export_volume",
      apiTitle: "export",
      color: "#6d5dd3",
      translation: "export_volume",
      isSpecial: true,
      planKey: "export_plan",
      actualKey: "export_actual",
      specialTitle: "export_volume_title"
    },
    { key: "own_funds", apiTitle: "own_funds", color: "#fdc748", translation: "own_funds" },
    { key: "projects_count", apiTitle: "projects", color: "#6d5dd3", translation: "projects" },
    { key: "project_cost", apiTitle: "production", color: "#00d097", translation: "production" },
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
              <h2>{(apiData.workplaces ?? 0).toLocaleString()}</h2>
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
                  <h3 className="export-title">{t(card.specialTitle)}</h3>
                  <div className="export-values">
                    <div className="value-item">
                      <span className="badge badge-plan">{t("plan")}</span>
                      <h2 className="value-number">
                        {(apiData[card.planKey] ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                      </h2>
                    </div>
                    <div className="value-item">
                      <span className="badge badge-actual">{t("actual")}</span>
                      <h2 className="value-number">
                        {(apiData[card.actualKey] ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                      </h2>
                    </div>
                  </div>
                </div>
              ) : (
                // ODDIY KARTALAR
                <div className="carddd">
                  <FaRegFolderOpen color={card.color} className="icon" id="ikonka" />
                  <h2>{(apiData[card.apiTitle] ?? 0).toLocaleString()}</h2>
                  <span>{t(card.translation)}</span>
                </div>
              )}
            </div>
          ))}

          {/* IJARA — faqat admin uchun */}
          {isAdmin && (
            <Link className="linkk" to="/add">
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
