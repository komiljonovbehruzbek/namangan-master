// src/pages/DistrictVillages.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Page.css";
import { useLanguage } from "../context/LanguageContext";
import DefoultImg from "../assets/rayon__img.png";
import Statistika from "../components/Statistika";
import result_icon_1 from "../assets/Frame.png";
import result_icon_2 from "../assets/Frame (1).png";

const DistrictVillages = () => {
  const { district: urlDistrict } = useParams();
  const navigate = useNavigate();
  const district = urlDistrict?.trim();

  const [qishloqlar, setQishloqlar] = useState([]);
  const [districtData, setDistrictData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sections, setSections] = useState([]);

  // Admin ma'lumotlarini tekshirish
  useEffect(() => {
    const saved = localStorage.getItem("userCredentials");
    const adminStatus = localStorage.getItem("isAdmin");
    if (saved && adminStatus === "true") {
      setIsAdmin(true);
    }
  }, []);

  // const getSectionOrder = (title) => ({ 'workplaces': 1, 'export': 2, 'production': 3 }[title] || 0);
  // const getSectionColor = (title) => ({ 'workplaces': '#3F8CFF', 'export': '#9C27B0', 'production': '#4CAF50' }[title] || '#3F8CFF');

  // Qishloqlarni olish
  useEffect(() => {
    const fetchQishloqlar = async () => {
      if (!district) {
        setError("Tuman nomi topilmadi");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const formattedDistrict = district
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        const res = await axios.get(
          `https://qwertyuiop999.pythonanywhere.com/api/districts/villages/?name=${encodeURIComponent(formattedDistrict)}`
        );

        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("API dan to‘g‘ri formatda ma’lumot olinmadi");
        }

        const qishloqlarList = res.data;
        setQishloqlar(qishloqlarList);
        setDistrictData({
          district: formattedDistrict,
          totalQishloq: qishloqlarList.length,
        });
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError(`"${district}" tumani topilmadi yoki hali ma'lumot kiritilmagan`);
          } else {
            setError(`Server xatosi: ${err.response.status}`);
          }
        } else if (err.request) {
          setError("Serverga ulanib bo‘lmadi. Internet aloqasini tekshiring.");
        } else {
          setError(`Ma’lumot olishda xato: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQishloqlar();
  }, [district]);

  // Fallback statistika
  useEffect(() => {
    if (qishloqlar.length > 0) {
      const fallbackSections = [
        {
          title: 'workplaces',
          plan: qishloqlar.length * 10,
          actual: qishloqlar.length * 8,
          total: Math.max(qishloqlar.length * 10, 1),
          color: '#3F8CFF',
          order: 1,
        },
        {
          title: 'export',
          plan: 100,
          actual: 75,
          total: 100,
          color: '#9C27B0',
          order: 2,
        },
        {
          title: 'production',
          plan: 100,
          actual: 60,
          total: 100,
          color: '#4CAF50',
          order: 3,
        },
      ];
      setSections(fallbackSections);
    }
  }, [qishloqlar.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
    setMessageType("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin";
    const isAdminUser = formData.email === adminEmail && formData.password === adminPassword;

    localStorage.setItem("userCredentials", JSON.stringify(formData));
    localStorage.setItem("isAdmin", isAdminUser ? "true" : "false");

    setIsAdmin(isAdminUser);
    setMessage(isAdminUser ? "Hush kelibsiz!" : "Siz admin emassiz!");
    setMessageType(isAdminUser ? "success" : "error");

    setTimeout(() => {
      setIsModalOpen(false);
      setFormData({ email: "", password: "" });
      setMessage("");
      setIsSubmitting(false);
    }, 2000);
  };

  const ProgressCircle = ({ value, total, label, color }) => {
    const safeTotal = Math.max(total, 1);
    const safeValue = Math.min(value, safeTotal);
    const pct = (safeValue / safeTotal) * 100;
    const r = 45;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;

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
          <text
            x="55"
            y="55"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="20"
            fontWeight="700"
            fill={color}
          >
            {safeValue.toLocaleString()}
          </text>
        </svg>
        <span>{t(label)}</span>
      </div>
    );
  };

  const handleBack = () => navigate("/");

  // Loading
  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "40px" }}>
        <div className="loading-spinner"></div>
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ color: "#d32f2f", marginBottom: "20px" }}>
          <h3>Xato yuz berdi</h3>
          <p>{error}</p>
        </div>
        <button
          onClick={handleBack}
          className="back-link"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#3F8CFF",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Statistika */}
      <div className="result">
        <div className="result_top">
          <h1 className="result_top_h1">{t("result_title")}</h1>
          {isAdmin && (
            <Link className="link" to="/add">
              <button className="result_top_btn1">
                <img src={result_icon_1} alt="Edit" />
                {t("edit_data")}
              </button>
            </Link>
          )}
          <button className="result_top_btn2" onClick={() => setIsModalOpen(true)}>
            <img src={result_icon_2} alt="Settings" />
          </button>
        </div>

        <div className="result_bottom">
          {sections.length === 0 ? (
            <p>{t("no_data") || "Ma'lumot topilmadi"}</p>
          ) : (
            sections.map((section) => (
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
                    textTransform: "capitalize",
                  }}
                >
                  {t(section.title) || section.title}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              ✕
            </button>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              {t("user_settings") || "Foydalanuvchi sozlamalari"}
            </h2>
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
                }}
              >
                {messageType === "success"
                  ? (t("welcome_admin") || "Hush kelibsiz, admin!")
                  : (t("not_admin") || "Siz admin emassiz!")}
              </div>
            )}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>{t("email") || "Email"}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={t("enter_email") || "Emailingizni kiriting"}
                />
              </div>
              <div className="form-group">
                <label>{t("password") || "Parol"}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder={t("enter_password") || "Parolingizni kiriting"}
                />
              </div>
              <button
                type="submit"
                className="modal-submit-btn"
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? "#ccc" : "#3F8CFF",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting
                  ? (t("checking") || "Tekshirilmoqda...")
                  : (t("submit") || "Yuborish")}
              </button>
            </form>
          </div>
        </div>
      )}

      <Statistika data={districtData} />

      {/* Qishloqlar */}
      <div className="swiper_all">
        <div className="header-flex" style={{ marginBottom: "20px" }}>
          <h1 className="swiper_h1">
            {districtData?.district || district?.replace(/-/g, " ") || "Tuman"} qishloqlari (
            {qishloqlar.length} ta)
          </h1>
        </div>

        {qishloqlar.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "#f8f9fa",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <p style={{ fontSize: "18px", color: "#6c757d" }}>
              {t("no_villages") || "Bu tumanda qishloq topilmadi"}
            </p>
          </div>
        ) : (
          <div className="swiper">
            {qishloqlar.map((q, index) => {
              const villageId = q?._id || q?.name || `village-${index}`;
              const slug = encodeURIComponent(villageId.toString().toLowerCase().replace(/ /g, "-"));

              return (
                <Link key={villageId} to={`/unicpage/${slug}`} className="link">
                  <div className="swiper_slide">
                    <div className="swiper_hr"></div>
                    <div className="swiper_flex unicorn_slide">
                      <div className="swiper_text">
                        <h2>{villageId}</h2>
                        <h6>{q.firstDesc || "Izoh yo‘q"}</h6>
                        <p>{q.totalCount} ta MChJ</p>
                      </div>
                      <div className="swiper_edit">
                        <div className="swiper_edit-img">
                          <img
                            src={q.firstImage || DefoultImg}
                            alt={villageId}
                            onError={(e) => (e.target.src = DefoultImg)}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DistrictVillages;
