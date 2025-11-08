// pages/Result.jsx
import React, { useState, useEffect } from "react";
import "../router/Page.css";
import result_icon_1 from "../assets/Frame.png";
import result_icon_2 from "../assets/Frame (1).png";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import api from "../axios";

function Result() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Section tartibini belgilash uchun funksiya
  const getSectionOrder = (title) => {
    const orderMap = {
      'workplaces': 1,
      'export': 2,
      'production': 3
    };
    return orderMap[title] || 0;
  };

  // Section rangini belgilash uchun funksiya
  const getSectionColor = (title) => {
    const colorMap = {
      'workplaces': '#3F8CFF',   // Ish joylari → ko'k
      'export': '#9C27B0',       // Eksport → binafsha
      'production': '#4CAF50'    // Ishlab chiqarish → yashil
    };
    return colorMap[title] || '#3F8CFF';
  };

  // pages/Result.jsx  (faqat o‘zgartirilgan qismlar ko‘rsatilgan)

  useEffect(() => {
    const saved = localStorage.getItem("userCredentials");
    if (saved) {
      const { email, password } = JSON.parse(saved);
      if (email === "admin@gmail.com" && password === "admin") setIsAdmin(true);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/statistics/global/");   // endpoint to‘g‘ri
        const data = res.data;  // endi bitta obyekt

        // 3 ta bo‘lim: Ish o‘rinlari, Eksport, Ishlab chiqarish
        const newSections = [
          {
            title: "workplaces",           // Ish o‘rinlari
            plan: data.ish_urni_planned,
            actual: data.ish_urni_real,
            total: data.ish_urni_planned || 1,
            color: getSectionColor("workplaces"),
            order: getSectionOrder("workplaces"),
          },
          {
            title: "export",               // Eksport
            plan: data.export_volume_planned,
            actual: data.export_volume_real,
            total: data.export_volume_planned || 1,
            color: getSectionColor("export"),
            order: getSectionOrder("export"),
          },
          {
            title: "production",           // Ishlab chiqarish
            plan: data.current_volume_per_year_planned,
            actual: data.current_volume_per_year_real,
            total: data.current_volume_per_year_planned || 1,
            color: getSectionColor("production"),
            order: getSectionOrder("production"),
          },
        ];

        // Tartib bo‘yicha saralash
        newSections.sort((a, b) => a.order - b.order);

        setSections(newSections);
      } catch (e) {
        console.error("Ma'lumotlarni yuklashda xatolik:", e);
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setMessage(""); setMessageType("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { email, password } = formData;
    const admin = email === "admin@gmail.com" && password === "admin";

    localStorage.setItem("userCredentials", JSON.stringify(formData));
    localStorage.setItem("isAdmin", admin ? "true" : "false");
    setIsAdmin(admin);

    setMessage(admin ? "Hush kelibsiz!" : "Siz admin emassiz!");
    setMessageType(admin ? "success" : "error");

    setTimeout(() => {
      setIsModalOpen(false);
      setFormData({ username: "", email: "", password: "" });
      setMessage(""); setIsSubmitting(false);
    }, 2000);
  };

  // Sonni qisqartirish funksiyasi
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
    return num.toLocaleString();
  };

  const ProgressCircle = ({ value, total, label, color }) => {
    const pct = total === 0 ? 0 : (value / total) * 100;
    const r = 45;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;

    // formatNumber funksiyasidan foydalanamiz
    const formatted = formatNumber(value);
    const [mainValue, unit] = formatted.includes(" ")
      ? formatted.split(" ")
      : [formatted, ""];

    return (
      <div className="result_card">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={r} stroke="#E0E0E0" strokeWidth="4" fill="none" />
          <circle
            cx="55"
            cy="55"
            r={r}
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset .5s ease",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />

          {/* ASOSIY SON – katta */}
          <text
            x="55"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fontWeight="700"
            fill={color}
          >
            {mainValue}
          </text>

          {/* BIRLIK – kichik, pastda */}
          {unit && (
            <text
              x="55"
              y="68"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fill={color}
              opacity="0.85"
              fontWeight="600"
            >
              {unit}
            </text>
          )}
        </svg>
        <span style={{ marginTop: "8px", fontSize: "14px" }}>{t(label)}</span>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="result">
        <div className="result_top">
          <h1 className="result_top_h1">{t("result_title")}</h1>
          {isAdmin && (
            <Link className="link" to="/uniquedit">
              <button className="result_top_btn1">
                <img src={result_icon_1} alt="Edit" />
                {t("edit_data")}
              </button>
            </Link>
          )}
          {!isAdmin &&
            <button className="result_top_btn2" onClick={() => setIsModalOpen(true)}>
              <img src={result_icon_2} alt="Settings" />
            </button>}
        </div>

        <div className="result_bottom">
          {loading ? (
            <div className="loading-placeholder">
              <p>{t("loading") || "Yuklanmoqda..."}</p>
            </div>
          ) : sections.length === 0 ? (
            <div className="loading-placeholder">
              <p>{t("no_data") || "Ma'lumot topilmadi"}</p>
            </div>
          ) : (
            sections.map(section => (
              <div
                key={section.title}
                className="result_box"
                style={{
                  borderRadius: "20px",
                  padding: "24px",
                  backgroundColor: "#fff",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                }}
              >
                <p
                  style={{
                    color: section.color,
                    fontWeight: "700",
                    fontSize: "18px",
                    marginBottom: "18px",
                    textAlign: "center",
                  }}
                >
                  {t(section.title)}
                </p>
                <div className="result_cards">
                  <ProgressCircle value={section.plan} total={section.total} label="plan" color={section.color} />
                  <ProgressCircle value={section.actual} total={section.total} label="actual" color={section.color} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>X</button>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{t("user_settings")}</h2>

            {message && (
              <div
                style={{
                  margin: "0 0 20px",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  textAlign: "center",
                  fontSize: "16px",
                  backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                  color: messageType === "success" ? "#155724" : "#721c24",
                  border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                }}
              >
                {t(messageType === "success" ? "welcome_admin" : "not_admin")}
              </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>{t("email")}</label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleInputChange} required placeholder={t("enter_email")}
                />
              </div>
              <div className="form-group">
                <label>{t("password")}</label>
                <input
                  type="password" name="password" value={formData.password}
                  onChange={handleInputChange} required placeholder={t("enter_password")}
                />
              </div>
              <button
                type="submit" className="modal-submit-btn" disabled={isSubmitting}
                style={{ backgroundColor: isSubmitting ? "#ccc" : "#3F8CFF", cursor: isSubmitting ? "not-allowed" : "pointer" }}
              >
                {isSubmitting ? t("checking") || "Tekshirilmoqda..." : t("submit")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Result;
