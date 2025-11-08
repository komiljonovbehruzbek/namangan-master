// src/pages/UnicPage.jsx
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Page.css";
import { useLanguage } from "../context/LanguageContext";
import DefoultImg from '../assets/rayon__img.png';
import Result from '../components/Result';
import Statistika from '../components/Statistika';

const UnicPage = () => {
  const { location: urlLocation } = useParams();
  const navigate = useNavigate();
  const [mchjs, setMchjs] = useState([]);
  const [villageData, setVillageData] = useState(null);
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchMchjs = async () => {
      if (!urlLocation) {
        setError("Qishloq nomi topilmadi");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // URL parametrini to'g'ri formatlash
        const formattedLocation = urlLocation
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        console.log("So'ralayotgan qishloq:", formattedLocation);

        // TO'G'RI API ENDPOINT
         const res = await axios.get(
          `https://compounds-spas-send-copyrights.trycloudflare.com/api/villages/view-mchj/?name=${encodeURIComponent(formattedLocation)}`,
          {
            "headers": {
              "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNjA4ODQ0LCJpYXQiOjE3NjI1OTQ0NDQsImp0aSI6IjUyYWFhNDFhOWUzYTQ1MGQ5NTBlYzZlZDEyZDkyZDU4IiwidXNlcl9pZCI6IjEifQ.iCeq2QAp5l7B6FeQ7t_qV3UXA7LYihQ0valTjuNRM_U"
            }
          }
        );

        console.log("API javobi:", res.data);

        // Ma'lumotlarni tekshirish
        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("API dan to'g'ri formatda ma'lumot olinmadi");
        }

        const dataArray = res.data;
        console.log("Olingan MChJlar:", dataArray);

        if (dataArray.length === 0) {
          setError(`${formattedLocation} qishlog'i uchun MChJ topilmadi`);
        } else {
          setMchjs(dataArray);
          setVillageData({
            location: formattedLocation,
            totalMchj: dataArray.length
          });

          // Tuman nomini olish (birinchi MChJ dan olamiz)
          const firstItemDistrict = dataArray[0]?.district;
          if (firstItemDistrict) {
            const formattedDistrict = firstItemDistrict.toLowerCase().replace(/ /g, '-');
            setDistrict(formattedDistrict);
          } else {
            setDistrict('');
          }
        }

      } catch (err) {
        console.error("Xato:", err);
        if (err.response) {
          if (err.response.status === 404) {
            setError(`"${urlLocation}" qishlog'i topilmadi`);
          } else {
            setError(`Server xatosi: ${err.response.status}`);
          }
        } else if (err.request) {
          setError("Serverga ulanib bo'lmadi. Internet aloqasini tekshiring.");
        } else {
          setError(`Ma'lumot olishda xato: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMchjs();
  }, [urlLocation]);

  // Orqaga qaytish
  const handleBack = () => {
    if (district) {
      navigate(`/district/${district}`);
    } else {
      navigate('/');
    }
  };

  // Bosh sahifaga qaytish
  const handleHome = () => {
    navigate('/');
  };

  // Loading komponenti
  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner"></div>
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  // Error komponenti
  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ color: "#d32f2f", marginBottom: "20px" }}>
          <h3>Xato yuz berdi</h3>
          <p>{error}</p>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {district && (
            <button onClick={handleBack} className="back-link" style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer"
            }}>
              Tumanga qaytish
            </button>
          )}
          <button onClick={handleHome} className="back-link" style={{
            padding: "10px 20px",
            backgroundColor: "#3F8CFF",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer"
          }}>
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Result data={villageData} type="village" />
      <Statistika data={villageData} />

      <div className='swiper_all'>
        <div className="header-flex" style={{ marginBottom: '20px' }}>
          <h1 className='swiper_h1'>
            {villageData?.location || "Qishloq"} MChJlari ({mchjs.length} ta)
          </h1>
          <div style={{ display: "flex", gap: "10px" }}>
            {district && (
              <button onClick={handleBack} className="back-link" style={{
                border: "none",
                cursor: "pointer"
              }}>
                Tumanga qaytish
              </button>
            )}
            <button onClick={handleHome} className="back-link" style={{
              border: "none",
              cursor: "pointer"
            }}>
              Bosh sahifaga
            </button>
          </div>
        </div>

        {mchjs.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            marginTop: "20px"
          }}>
            <p style={{ fontSize: "18px", color: "#6c757d" }}>
              {t("no_companies") || "MChJlar topilmadi"}
            </p>
          </div>
        ) : (
          <div className="swiper">
            {mchjs.map((item, index) => (
              <div key={item._id || index} className='swiper_slide'>
                <div className='swiper_hr'></div>
                <div className='swiper_flex unicorn_slide'>
                  <div className="swiper_text">
                    <h2>{item.title || item.name || "Noma'lum MChJ"}</h2>
                    <h6>{item.desc || item.description || "Izoh yo'q"}</h6>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                      {item.district ? `Tuman: ${item.district}` : ''}
                      {item.location ? ` | Qishloq: ${item.location}` : ''}
                    </p>
                  </div>
                  <div className="swiper_edit">
                    <div className="swiper_edit-img">
                      <img
                        src={item.image || DefoultImg}
                        alt={item.title || "MChJ"}
                        onError={(e) => {
                          e.target.src = DefoultImg;
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnicPage;
