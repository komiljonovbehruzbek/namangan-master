import React, { useRef, useState, useEffect } from 'react';
import './UniqueEdit.css';

// Icons
import { FiUpload, FiEdit } from "react-icons/fi";
import { LuImage } from "react-icons/lu";

function UniqueEdit() {
    const [imagePreview, setImagePreview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    const fileInputRef = useRef(null);
    
    // ==============================================================
    // ADMIN SESSIYA + 1 SOATDAN KEYIN REFRESH
    // ==============================================================
    useEffect(() => {
        const checkAdminSession = () => {
            const saved = localStorage.getItem("userCredentials");
            const loginTime = localStorage.getItem("loginTime");

            if (saved && loginTime) {
                const { email, password } = JSON.parse(saved);
                const now = Date.now();
                const oneHour = 60 * 60 * 1000; // 1 soat = 3,600,000 ms

                if (
                    email === "admin@gmail.com" &&
                    password === "admin" &&
                    now - parseInt(loginTime) < oneHour
                ) {
                    setIsAdmin(true);
                    setIsEditable(true);
                } else {
                    // 1 soat o'tdi → sessiyani tozalash + sahifani yangilash
                    localStorage.removeItem("userCredentials");
                    localStorage.removeItem("isAdmin");
                    localStorage.removeItem("loginTime");
                    setIsAdmin(false);
                    setIsEditable(false);

                    // SAHIFANI AVTOMATIK YANGILASH
                    window.location.reload();
                }
            }
        };

        checkAdminSession();

        // Har 10 soniyada tekshirish (tezroq aniqlash uchun)
        const interval = setInterval(checkAdminSession, 10_000);

        return () => clearInterval(interval);
    }, []);

    // ==============================================================
    // RASMLAR YUKLASH
    // ==============================================================
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

    // ==============================================================
    // MODAL INPUT
    // ==============================================================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setMessage("");
        setMessageType("");
    };

    // ==============================================================
    // ADMIN KIRISH + loginTime saqlash
    // ==============================================================
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { email, password } = formData;
        const admin = email === "admin@gmail.com" && password === "admin";

        if (admin) {
            const loginTime = Date.now(); // Hozirgi vaqt
            localStorage.setItem("userCredentials", JSON.stringify(formData));
            localStorage.setItem("isAdmin", "true");
            localStorage.setItem("loginTime", loginTime); // Yangi key
            setIsAdmin(true);
            setIsEditable(true);
            setMessage("Hush kelibsiz Admin!");
            setMessageType("success");
        } else {
            setMessage("Noto'g'ri email yoki parol!");
            setMessageType("error");
        }

        setTimeout(() => {
            setIsModalOpen(false);
            setFormData({ email: "", password: "" });
            setIsSubmitting(false);
        }, 2000);
    };

    const openEditModal = () => {
        setIsModalOpen(true);
        setMessage("");
        setMessageType("");
    };

    // ==============================================================
    // RENDER
    // ==============================================================
    return (
        <div className='uniqueEdit'>
            <div className="container">
                {/* RASMLAR BO'LIMI */}
                <h2 className='photo-section-title'>Лавҳа сурати</h2>
                <div className="photo-section">
                    <div className="form_photo">
                        <div
                            className="photo-box"
                            onClick={handleImageClick}
                            style={{
                                cursor: isEditable ? 'pointer' : 'not-allowed',
                                opacity: isEditable ? 1 : 0.7
                            }}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="preview-image" />
                            ) : (
                                <>
                                    <div className="upload-icon-div">
                                        <FiUpload className="upload-icon" />
                                    </div>
                                    <p className="upload-text">
                                        Расмларингизни юклаш учун шуерни босинг
                                    </p>
                                    <span className="upload-types">Jpg, Png, Svg.</span>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={!isEditable}
                            />
                            <button
                                type="button"
                                className="upload-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isEditable) handleImageClick();
                                }}
                                style={{ cursor: isEditable ? 'pointer' : 'not-allowed' }}
                            >
                                <LuImage />
                                Сурат юклаш
                            </button>
                        </div>
                    </div>

                    <button
                        className='edit-btn'
                        onClick={openEditModal}
                        style={{ cursor: 'pointer' }}
                    >
                        <FiEdit fontSize={20} />
                        Маълумотларни юклаш
                    </button>
                </div>

                {/* FORM BO'LIMI */}
                <div className="form-div">
                    <h2 className="photo-section-title">Умумий маълумот</h2>
                    <form method="get" className='form'>
                        <div className="form-left">
                            <label>
                                <p className='input-title'>Шаҳар-туман номи</p>
                                <select className='input' disabled={!isEditable}>
                                    <option value="">Наманган шаҳри</option>
                                    <option value="">Наманган шаҳри</option>
                                </select>
                            </label>
                            <label>
                                <p className='input-title'>Саноат зона</p>
                                <input placeholder='КСЗ' type="text" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>СТИР</p>
                                <input placeholder='306709076' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Лойиҳа умумий қиймати (млн. сўм)</p>
                                <input placeholder='15750' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Банк кредити (млн. сўм)</p>
                                <input placeholder='7500' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Яратиладиган иш ўрни</p>
                                <input placeholder='100' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Яратиладиган иш ўрни</p>
                                <input placeholder='100' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label className='plan-div'>
                                <p className="input-title">Жорий йилда амалга оширилган экспорт хажми (минг. долл)</p>
                                <div className="reja_amal">
                                    <label className='reja'>
                                        <p className='input-title'>режа</p>
                                        <input placeholder='2021' type="number" className="input" disabled={!isEditable} />
                                    </label>
                                    <label className='reja'>
                                        <p className='input-title'>амалда</p>
                                        <input placeholder='01' type="number" className="input" disabled={!isEditable} />
                                    </label>
                                </div>
                            </label>
                            <label>
                                <p className='input-title'>Лойиҳа ҳолати (Амалга оширилмоқда / Ишга тушган)</p>
                                <input placeholder='Erkak' type="text" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Шундан: Лойиҳа бўйича 2025 йилда ўзлаштирилган маблағ (млн сўм)</p>
                                <input placeholder='80' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label className='plan-div'>
                                <p className="photo-section-title">Ишга тушиш муддати</p>
                                <div className="reja_amal">
                                    <label className='reja'>
                                        <p className='input-title'>йил</p>
                                        <input placeholder='2021' type="number" className="input" disabled={!isEditable} />
                                    </label>
                                    <label className='reja'>
                                        <p className='input-title'>ой</p>
                                        <input placeholder='01' type="number" className="input" disabled={!isEditable} />
                                    </label>
                                </div>
                            </label>
                            <label className='plan-div'>
                                <p className="photo-section-title">КСЗга ҳудудига жойлаштирилган вақти</p>
                                <div className="reja_amal">
                                    <label className='reja'>
                                        <p className='input-title'>йил</p>
                                        <input placeholder='2019' type="number" className="input" disabled={!isEditable} />
                                    </label>
                                    <label className='reja'>
                                        <p className='input-title'>ой</p>
                                        <input placeholder='09' type="number" className="input" disabled={!isEditable} />
                                    </label>
                                </div>
                            </label>
                        </div>

                        <div className="form-right">
                            <label>
                                <p className='input-title'>Лойиҳа номи</p>
                                <input placeholder='Сутни қайта ишлаш ва кондитер махсулотларини ишлаб чиқариш' type="text" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>КСЗ номи</p>
                                <input placeholder='Даштбоғ КСЗ' type="text" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Лойиҳа ташаббускори</p>
                                <input placeholder='"VODIY CANDY MILK" MЧЖ' type="text" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Ажратилган ер майдони (га)</p>
                                <input placeholder='0.15' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>ўз маблағи (млн. сўм)</p>
                                <input placeholder='8250' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>чет эл инвестицияси (минг долл.)</p>
                                <input placeholder='1' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Хизмат кўрсатувчи банк</p>
                                <input placeholder='"МИКРОКРЕДИТБАНК" АТ БАНКИ' type="text" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Жорий йилда амалда ишлаб чиқарилган хажм (млн. сўм)</p>
                                <input placeholder='3100' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Жорий йилда амалга оширилган импорт хажми (минг. долл)</p>
                                <input placeholder='2' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label>
                                <p className='input-title'>Жорий йилда амалда ишлаб чиқарилган хажм (млн. сўм)</p>
                                <input placeholder='3100' type="number" className='input' disabled={!isEditable} />
                            </label>
                            <label className='plan-div'>
                                <p className="photo-section-title">Ишга тушиш вақти</p>
                                <div className="reja_amal">
                                    <label className='reja'>
                                        <p className='input-title'>йил</p>
                                        <input placeholder='2021' type="number" className="input" disabled={!isEditable} />
                                    </label>
                                    <label className='reja'>
                                        <p className='input-title'>ой</p>
                                        <input placeholder='01' type="number" className="input" disabled={!isEditable} />
                                    </label>
                                </div>
                            </label>
                            <div className="edit-btn-div">
                                <button
                                    className='edit-btn'
                                    type="button"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <FiEdit fontSize={20} />
                                    Маълумотларни сақлаш
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>X</button>
                        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Админ кириш</h2>

                        {message && (
                            <div
                                style={{
                                    margin: "0 0 20px",
                                    padding: "19px 18px",
                                    borderRadius: "10px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    fontSize: "16px",
                                    backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                                    color: messageType === "success" ? "#155724" : "#721c24",
                                    border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                                }}
                            >
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="admin@gmail.com"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-group">
                                <label>Parol</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="admin"
                                    disabled={isSubmitting}
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
                                {isSubmitting ? "Tekshirilmoqda..." : "Kirish"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UniqueEdit;
