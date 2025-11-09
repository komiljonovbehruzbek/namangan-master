import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Page.css";
import { useLanguage } from "../context/LanguageContext";
import Result from '../components/Result';
import Statistika from '../components/Statistika';
import { FaTrashAlt } from "react-icons/fa";

const UnicPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const [mchjs, setMchjs] = useState([]);
  const [villageData, setVillageData] = useState(null);
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    const fetchMchjs = async () => {
      if (!location) {
        setError("Qishloq nomi topilmadi");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let formattedLocation = location.replace(/-/g, ' ');
        formattedLocation = formattedLocation.charAt(0).toUpperCase() + formattedLocation.slice(1);

        const res = await axios.get(
          `https://qwertyuiop999.pythonanywhere.com/api/villages/view-mchj/?name=${encodeURIComponent(formattedLocation)}`
        );

        console.log("API dan kelgan ma'lumot:", res.data); // Debug uchun

        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("API dan to'g'ri formatda ma'lumot olinmadi");
        }

        const dataArray = res.data;
        if (dataArray.length === 0) {
          setError(`${formattedLocation} qishlog'i uchun MChJ topilmadi`);
        } else {
          setMchjs(dataArray);
          setVillageData({
            location: formattedLocation,
            totalMchj: dataArray.length
          });

          const firstItemDistrict = dataArray[0]?.district;
          if (firstItemDistrict) {
            const formattedDistrict = firstItemDistrict.toLowerCase().replace(/ /g, '-');
            setDistrict(formattedDistrict);
          }
        }
      } catch (err) {
        console.error("Xato:", err);
        if (err.response?.status === 404) {
          setError(`"${location}" qishlog'i topilmadi`);
        } else if (err.response) {
          setError(`Server xatosi: ${err.response.status}`);
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
  }, [location]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu MChJni o'chirishni xohlaysizmi?")) return;

    try {
      await axios.delete(
        `https://qwertyuiop999.pythonanywhere.com/api/villages/delete-mchj/${id}/`
      );

      setMchjs(prev => prev.filter(item => item._id !== id));
      setVillageData(prev => ({
        ...prev,
        totalMchj: prev.totalMchj - 1
      }));
    } catch (err) {
      console.error("O'chirishda xato:", err);
      alert("MChJni o'chirishda xato yuz berdi");
    }
  };

  const handleBack = () => {
    if (district) {
      navigate(`/district/${district}`);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  // API dan kelgan ma'lumot strukturasini tekshirish funksiyasi
  const getMchjName = (item) => {
    return item.tashabbuskori || item.sanoat_zona || item.desc || item.description || "Izoh yo'q";
  };

  const getMchjDescription = (item) => {
    return item.loyiha_nomi || item.title || item.name || "Noma'lum MChJ";
  };


  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner"></div>
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }} >
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
              <button onClick={handleBack} className="back-link">
                Tumanga qaytish
              </button>
            )}
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
                  <div
                    className="swiper_text"
                    onClick={() => {
                      if (item.id) {
                        navigate(`/uniquedit/${item.id}`);
                      } else {
                        alert("MChJ ID si topilmadi!");
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <h2>{getMchjName(item)}</h2>
                    <h6>{getMchjDescription(item)}</h6>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                      {item.district ? `Tuman: ${item.district}` : ''}
                      {item.location ? ` | Qishloq: ${item.location}` : ''}
                    </p>
                  </div>


                  {isAdmin && (
                    <div className="swiper_edit" style={{ position: 'relative' }}>
                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{
                          background: 'rgba(220, 53, 69, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    </div>
                  )}
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
