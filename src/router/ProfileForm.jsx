// src/pages/Unicorn.jsx (yoki ProfileForm.jsx)
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { FiUploadCloud } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";


// Images
import DefoultImg from '../assets/rayon__img.png';
import "./Page.css";

import { useLanguage } from "../context/LanguageContext";

const ProfileForm = () => {
  const [tumanlar, setTumanlar] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Forma
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Ma'lumotlarni yuklash
  const fetchData = async () => {
    try {
      const res = await axios.get("https://namangan-back-api.onrender.com/api/unicorns");
      setTumanlar(res.data);
    } catch (err) {
      console.error("Ma'lumot olishda xato:", err);
    }
  };
  const { t } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  // Modal ochish
  const openModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentId(item._id);
      setTitle(item.title);
      setDesc(item.desc);
      setImagePreview(item.image || null);
    } else {
      setIsEdit(false);
      setCurrentId(null);
      setTitle("");
      setDesc("");
      setImagePreview(null);
    }
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setTitle("");
    setDesc("");
    setImagePreview(null);
    setCurrentId(null);
    setIsEdit(false);
  };

  // Rasm tanlash
  const handleImageClick = () => fileInputRef.current.click();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // handleSave — XATOSIZ + DARHOL REFRESH
  const handleSave = async () => {
    if (!title.trim() || !desc.trim()) {
      alert("Iltimos, nomi va izohni to'ldiring!");
      return;
    }

    const data = {
      title,
      desc,
      image: imagePreview || "",
    };

    try {
      if (isEdit) {
        await axios.put(`https://namangan-back-api.onrender.com/api/unicorns/${currentId}`, data);
        alert("✅ Muvaffaqiyatli yangilandi!");
      } else {
        await axios.post("https://namangan-back-api.onrender.com/api/unicorns", data);
        alert("✅ Yangi kompaniya qo'shildi!");
      }

      // Darhol yangilash
      window.location.reload();
    } catch (err) {
      console.error("Xato tafsiloti:", err);

      if (err.code === "ERR_NETWORK") {
        alert("❌ Server ishlamayapti. Backendni yoqing!");
      } else if (err.response?.status === 404) {
        alert("❌ Yo'q element! ID noto'g'ri.");
      } else if (err.response?.status === 500) {
        alert("❌ Server xatosi. Backend loglarni tekshiring.");
      } else {
        alert("❌ Rasmni xajmi juda katta xajmi kichik rasm kiriting");

      }
    }
  };

  // O‘CHIRISH
  // handleDelete — XATOSIZ
  const handleDelete = async (id) => {
    if (!window.confirm("❌ Rostan o‘chirasizmi?")) return;

    try {
      await axios.delete(`https://namangan-back-api.onrender.com/api/unicorns/${id}`);
      alert("✅ Muvaffaqiyatli o‘chirildi!");
      window.location.reload();
    } catch (err) {
      console.error("O‘chirish xatosi:", err);
      alert("❌ O‘chirib bo‘lmadi. Serverni tekshiring.");
    }
  };

  return (
    <div className="container">
      <br />
      <div className="swiper_all">
        <div className="header-flex" style={{ marginBottom: "20px" }}>
          <h1 className="swiper_h1">{t("rayonlar_add")}</h1>
          <button onClick={() => openModal()} className="save-btn">
            + {t("yangi_qoshish_btn_add")}
          </button>
        </div>

        <div className="swiper">
          {tumanlar.length > 0 ? (
            tumanlar.map((item) => (
              <div key={item._id} className="swiper_slide">
                <div className="swiper_hr"></div>
                <div className="swiper_flex unicorn_slide">
                  <div className="swiper_text">
                    <h2>{item.title}</h2>
                    <h6>{item.desc}</h6>
                    <p>
                      <small>
                        {new Date(item.date).toLocaleDateString("uz-UZ", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </p>
                  </div>

                  <div className="swiper_edit">
                    <div className="swiper_edit-img">
                      <img
                        src={item.image || DefoultImg}
                        alt={item.title}
                        style={{ borderRadius: "8px", objectFit: "cover", width: "100%", height: "120px" }}
                      />
                    </div>

                    <div className="swiper_actions" style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                      <button onClick={() => openModal(item)} className="edit-btn">
                        <FiEdit className='btn_f_edit' style={{ cursor: "pointer" }} />
                      </button>
                      <RiDeleteBin6Line
                        onClick={() => handleDelete(item._id)}
                        style={{ cursor: "pointer", color: "#e74c3c", fontSize: "25px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>{t("qidirilmoqda_add")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-content">
              <div className="modal-header">
                <h3 className='form_h3'>{isEdit ? "Tahrirlash" : "Yangi qo'shish"}</h3>
                <button className="close-btn" onClick={closeModal}>×</button>
              </div>

              <div className="photo-section">
                <div className="form_photo">

                  <div className="photo-box" onClick={handleImageClick}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="preview-image" />
                    ) : (
                      <>
                        <FiUploadCloud className="upload-icon" />
                        <p className="upload-text">Rasm yuklash uchun bosing</p>
                        <span className="upload-types">JPG, PNG</span>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick();
                    }}
                  >
                    Rasm tanlash
                  </button>
                </div>
              </div>

              <div className="form-section">
                <h2 className='form_h2'>Ma'lumotlar</h2>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <br />
                    <label>Nomi</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      id='form_nom'
                      placeholder="Masalan: IT Park"
                      style={{ width: "100%", marginTop: "5px", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                    />
                  </div>
                  <div>
                    <label>Izoh</label>
                    <textarea
                      rows="4"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Qisqacha izoh..."
                      style={{ width: "100%", marginTop: "5px", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "20px", textAlign: "right" }}>
                <button className="cancel-btn" onClick={closeModal}>
                  Bekor qilish
                </button>
                <button className="save-btn" onClick={handleSave} style={{ marginLeft: "10px" }}>
                  {isEdit ? "Yangilash" : "Saqlash"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
