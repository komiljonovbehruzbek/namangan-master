import React, { useRef, useState, useEffect } from 'react';
import './UniqueEdit.css';
import { FiUpload, FiEdit } from "react-icons/fi";
import { LuImage } from "react-icons/lu";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function FormData() {
    const navigate = useNavigate();

    const [imagePreview, setImagePreview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginFormData, setLoginFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);

    const [districts, setDistricts] = useState([]);
    const [districtsLoading, setDistrictsLoading] = useState(true);

    const [formValues, setFormValues] = useState({
        name: "",
        description: "",
        district: ""
    });

    const fileInputRef = useRef(null);

    // Admin sessiyasini tekshirish
    useEffect(() => {
        const checkAdminSession = () => {
            const saved = localStorage.getItem("userCredentials");
            const loginTime = localStorage.getItem("loginTime");

            if (saved && loginTime) {
                const { email, password } = JSON.parse(saved);
                const now = Date.now();
                const oneHour = 60 * 60 * 1000;

                if (email === "admin@gmail.com" && password === "admin" && now - parseInt(loginTime) < oneHour) {
                    setIsAdmin(true);
                    setIsEditable(true);
                } else {
                    localStorage.removeItem("userCredentials");
                    localStorage.removeItem("isAdmin");
                    localStorage.removeItem("loginTime");
                    setIsAdmin(false);
                    setIsEditable(false);
                }
            }
        };

        checkAdminSession();
        const interval = setInterval(checkAdminSession, 10000);
        return () => clearInterval(interval);
    }, []);

    // Tumanlarni yuklash
    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                setDistrictsLoading(true);
                const res = await axios.get('https://qwertyuiop999.pythonanywhere.com/api/districts/');
                setDistricts(res.data);
            } catch (err) {
                console.error("Tumanlar yuklanmadi:", err);
                setMessage("Tumanlar ro'yxati yuklanmadi");
                setMessageType("error");
            } finally {
                setDistrictsLoading(false);
                setLoading(false);
            }
        };

        fetchDistricts();
    }, []);

    const handleImageClick = () => {
        if (isEditable) fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData((prev) => ({ ...prev, [name]: value }));
        setMessage("");
        setMessageType("");
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { email, password } = loginFormData;
        const admin = email === "admin@gmail.com" && password === "admin";

        if (admin) {
            const loginTime = Date.now();
            localStorage.setItem("userCredentials", JSON.stringify(loginFormData));
            localStorage.setItem("isAdmin", "true");
            localStorage.setItem("loginTime", loginTime.toString());
            setIsAdmin(true);
            setIsEditable(true);
            setMessage("Hush kelibsiz Admin!");
            setMessageType("success");

            setTimeout(() => {
                setIsModalOpen(false);
                setLoginFormData({ email: "", password: "" });
                setIsSubmitting(false);
            }, 1500);
        } else {
            setMessage("Noto'g'ri email yoki parol!");
            setMessageType("error");
            setTimeout(() => {
                setIsSubmitting(false);
            }, 1500);
        }
    };

    const openEditModal = () => {
        setIsModalOpen(true);
        setMessage("");
        setMessageType("");
    };

    const handleSave = async () => {
        if (!isEditable) {
            alert("Ruxsat yo'q!");
            return;
        }

        if (!formValues.name || !formValues.district) {
            alert("Qishloq nomi va tumanni to'ldiring!");
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.post('https://qwertyuiop999.pythonanywhere.com/api/villages/', {
                name: formValues.name,
                description: formValues.description,
                district: formValues.district,
                MChJlar: []
            });
            alert("Qishloq muvaffaqiyatli yaratildi!");
            navigate('/'); // Orqaga yoki kerakli sahifaga o'tkazish
        } catch (err) {
            console.error("Saqlashda xato:", err);
            alert("Saqlashda xato: " + (err.response?.data?.detail || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="uniqueEdit">
                <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="loading-spinner"></div>
                    <p>Ma'lumotlar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='uniqueEdit'>
            <div className="container">
                {message && (
                    <div style={{
                        margin: "20px 0",
                        padding: "15px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        textAlign: "center",
                        fontSize: "16px",
                        backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                        color: messageType === "success" ? "#155724" : "#721c24",
                        border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                    }}>
                        {message}
                    </div>
                )}

                <h2 className='photo-section-title'>Лавҳа сурати</h2>
                <div className="photo-section">
                    <div className="form_photo">
                        <div
                            className="photo-box"
                            onClick={handleImageClick}
                            style={{ cursor: isEditable ? 'pointer' : 'not-allowed', opacity: isEditable ? 1 : 0.7 }}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="preview-image" />
                            ) : (
                                <>
                                    <div className="upload-icon-div"><FiUpload className="upload-icon" /></div>
                                    <p className="upload-text">Расмларингизни юклаш учун шуерни босинг</p>
                                    <span className="upload-types">Jpg, Png, Svg.</span>
                                </>
                            )}
                            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleImageChange} disabled={!isEditable} />
                            <button type="button" className="upload-btn" onClick={(e) => { e.stopPropagation(); if (isEditable) handleImageClick(); }} disabled={!isEditable}>
                                <LuImage /> Сурат юклаш
                            </button>
                        </div>
                    </div>

                    <button className='edit-btn' onClick={openEditModal} style={{ cursor: 'pointer' }}>
                        <FiEdit fontSize={20} /> Маълумотларни таҳрирлаш
                    </button>
                </div>

                <div className="form-div">
                    <h2 className="photo-section-title">Умумий маълумот</h2>

                    <form className='form'>
                        <div className="form-left">
                            <label>
                                <span className='input-title'>Шаҳар-туман номи</span>
                                <select className='input' name="district" value={formValues.district} onChange={handleFormInputChange} disabled={!isEditable}>
                                    <option value="">Танланг</option>
                                    {districts.map(dist => (
                                        <option key={dist.id} value={dist.id}>
                                            {dist.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label><p className='input-title'>Қишлоқ номи</p>
                                <input type="text" className='input' name="name" value={formValues.name} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Тавсиф</p>
                                <input type="text" className='input' name="description" value={formValues.description} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                        </div>

                        <div className="form-right">
                            {isAdmin && (
                                <div className="edit-btn-div">
                                    <button className='edit-btn' type="button" onClick={handleSave} disabled={isSubmitting}>
                                        <FiEdit fontSize={20} />
                                        {isSubmitting ? "Сақланилмоқда..." : "Қишлоқни сақлаш"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Admin Login Modal */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>X</button>
                            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Админ кириш</h2>

                            {message && (
                                <div style={{
                                    margin: "0 0 20px",
                                    padding: "19px 18px",
                                    borderRadius: "10px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    fontSize: "16px",
                                    backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                                    color: messageType === "success" ? "#155724" : "#721c24",
                                    border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                                }}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleLoginSubmit} className="modal-form">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" value={loginFormData.email} onChange={handleLoginInputChange} required placeholder="admin@gmail.com" disabled={isSubmitting} />
                                </div>
                                <div className="form-group">
                                    <label>Parol</label>
                                    <input type="password" name="password" value={loginFormData.password} onChange={handleLoginInputChange} required placeholder="admin" disabled={isSubmitting} />
                                </div>
                                <button type="submit" className="modal-submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? "Tekshirilmoqda..." : "Kirish"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FormData;
