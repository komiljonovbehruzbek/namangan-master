import React, { useRef, useState, useEffect } from 'react';
import './UniqueEdit.css';
import { FiUpload, FiEdit } from "react-icons/fi";
import { LuImage } from "react-icons/lu";
import api from "../axios";
import { useParams } from "react-router-dom";
import axios from 'axios';

function UniqueEdit() {
    const { id } = useParams();

    const [imagePreview, setImagePreview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginFormData, setLoginFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [mchjData, setMchjData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formValues, setFormValues] = useState({
        city: "",
        zone: "",
        stir: "",
        cost: "",
        credit: "",
        created_positions: "",
        export_plan: "",
        export_actual: "",
        status: "",
        ozlashtirilgan: "",
        launch_year: "",
        launch_month: "",
        placement_year: "",
        placement_month: "",
        name: "",
        ksz_name: "",
        initiator: "",
        land: "",
        uz_mablagi: "",
        foreign_invest: "",
        bank: "",
        current_volume: "",
        import_volume: "",
        current_volume_2: "",
        launch_year_2: "",
        launch_month_2: ""
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

                if (email === "admin@gmail.com" &&
                    password === "admin" &&
                    now - parseInt(loginTime) < oneHour) {
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
        const interval = setInterval(checkAdminSession, 10_000);
        return () => clearInterval(interval);
    }, []);

    // MChJ ma'lumotlarini yuklash - HAR QANDAY HOLATDA (admin bo'lmasa ham)
    useEffect(() => {
        const fetchMchjData = async () => {
            if (!id) {
                console.log("MChJ ID si topilmadi");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log("MChJ ma'lumotlarini yuklash uchun so'rov yuborilmoqda...");

                // To'g'ri endpoint - barcha MChJ lar ro'yxatidan ID bo'yicha qidirish
                const res = await axios.get(`https://qwertyuiop999.pythonanywhere.com/api/villages/view-mchj/`);

                if (res.data && Array.isArray(res.data)) {
                    // ID bo'yicha MChJ ni topish
                    const foundMchj = res.data.find(item => item._id === id || item.id === id);

                    if (foundMchj) {
                        console.log("Topilgan MChJ:", foundMchj);
                        setMchjData(foundMchj);

                        // FormValues ni to'ldirish
                        setFormValues({
                            city: foundMchj.city || foundMchj.district || "",
                            zone: foundMchj.zone || "",
                            stir: foundMchj.stir || foundMchj.STIR || "",
                            cost: foundMchj.cost || "",
                            credit: foundMchj.credit || "",
                            created_positions: foundMchj.created_positions || "",
                            export_plan: foundMchj.export_plan || foundMchj.export_volume_planned || "",
                            export_actual: foundMchj.export_actual || foundMchj.export_volume_real || "",
                            status: foundMchj.status || "",
                            ozlashtirilgan: foundMchj.ozlashtirilgan || foundMchj.ozlashtirilgan_mublag || "",
                            launch_year: foundMchj.launch_year || "",
                            launch_month: foundMchj.launch_month || "",
                            placement_year: foundMchj.placement_year || "",
                            placement_month: foundMchj.placement_month || "",
                            name: foundMchj.name || foundMchj.title || "",
                            ksz_name: foundMchj.ksz_name || "",
                            initiator: foundMchj.initiator || "",
                            land: foundMchj.land || "",
                            uz_mablagi: foundMchj.uz_mablagi || "",
                            foreign_invest: foundMchj.foreign_invest || foundMchj.foreign_investments || "",
                            bank: foundMchj.bank || "",
                            current_volume: foundMchj.current_volume || foundMchj.current_volume_per_year_real || "",
                            import_volume: foundMchj.import_volume || foundMchj.current_import_volume_per_year || "",
                            current_volume_2: foundMchj.current_volume_2 || foundMchj.current_volume_per_year_real || "",
                            launch_year_2: foundMchj.launch_year_2 || "",
                            launch_month_2: foundMchj.launch_month_2 || ""
                        });
                    } else {
                        throw new Error(`MChJ topilmadi (ID: ${id})`);
                    }
                } else {
                    throw new Error("API dan noto'g'ri formatda ma'lumot qaytardi");
                }
            } catch (err) {
                console.error("MChJ ma'lumotlari yuklanmadi:", err);
                // Xatoni ko'rsatish, lekin sahifani to'liq bloklamaslik
                setMessage(`MChJ ma'lumotlari yuklanmadi: ${err.message}`);
                setMessageType("error");
            } finally {
                setLoading(false);
            }
        };

        fetchMchjData();
    }, [id]);

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

            // Admin kirgandan so'ng ma'lumotlarni qayta yuklash
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            setMessage("Noto'g'ri email yoki parol!");
            setMessageType("error");
        }

        setTimeout(() => {
            setIsModalOpen(false);
            setLoginFormData({ email: "", password: "" });
            setIsSubmitting(false);
        }, 2000);
    };

    const openEditModal = () => {
        setIsModalOpen(true);
        setMessage("");
        setMessageType("");
    };

    const handleSave = async () => {
        if (!isEditable || !id) {
            alert("MChJ ID topilmadi yoki ruxsat yo'q!");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.put(`/villages/update-mchj/${id}/`, formValues);
            alert("Ma'lumotlar muvaffaqiyatli saqlandi!");

            // Saqlagandan so'ng yangi ma'lumotlarni yuklash
            const res = await axios.get(`https://qwertyuiop999.pythonanywhere.com/api/villages/view-mchj/`);
            const updatedMchj = res.data.find(item => item._id === id || item.id === id);
            if (updatedMchj) {
                setMchjData(updatedMchj);
            }
        } catch (err) {
            console.error("Saqlashda xato:", err);
            alert("Saqlashda xato yuz berdi!");
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
                {/* Xabar ko'rsatish */}
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
                            style={{
                                cursor: isEditable ? 'pointer' : 'not-allowed',
                                opacity: isEditable ? 1 : 0.7
                            }}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="preview-image" />
                            ) : mchjData?.image ? (
                                <img src={mchjData.image} alt="MChJ" className="preview-image" />
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
                                disabled={!isEditable}
                            >
                                <LuImage />
                                Сурат юклаш
                            </button>
                        </div>
                    </div>

                    {!isAdmin && (
                        <button
                            className='edit-btn'
                            onClick={openEditModal}
                            style={{ cursor: 'pointer' }}
                        >
                            <FiEdit fontSize={20} />
                            Маълумотларни таҳрирлаш
                        </button>
                    )}
                </div>

                <div className="form-div">
                    <h2 className="photo-section-title">Умумий маълумот</h2>

                    {/* MChJ asosiy ma'lumotlari */}
                    {mchjData && (
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            border: '1px solid #dee2e6'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: '#333' }}>MChJ Asosiy Ma'lumotlari</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <p><strong>Nomi:</strong> {mchjData.title || mchjData.name}</p>
                                <p><strong>Tuman:</strong> {mchjData.district}</p>
                                <p><strong>Qishloq:</strong> {mchjData.location}</p>
                                <p><strong>Tavsif:</strong> {mchjData.desc || mchjData.description}</p>
                            </div>
                        </div>
                    )}

                    <form className='form'>
                        <div className="form-left">
                            <label>
                                <p className='input-title'>Шаҳар-туман номи</p>
                                <select
                                    className='input'
                                    name="city"
                                    value={formValues.city}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                >
                                    <option value="">Танланг</option>
                                    <option value="Наманган шаҳри">Наманган шаҳри</option>
                                    <option value="Поп тумани">Поп тумани</option>
                                </select>
                            </label>
                            <label>
                                <p className='input-title'>Саноат зона</p>
                                <input
                                    placeholder='КСЗ'
                                    type="text"
                                    className='input'
                                    name="zone"
                                    value={formValues.zone}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>СТИР</p>
                                <input
                                    placeholder='306709076'
                                    type="number"
                                    className='input'
                                    name="stir"
                                    value={formValues.stir}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>Лойиҳа умумий қиймати (млн. сўм)</p>
                                <input
                                    placeholder='15750'
                                    type="number"
                                    className='input'
                                    name="cost"
                                    value={formValues.cost}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>Банк кредити (млн. сўм)</p>
                                <input
                                    placeholder='7500'
                                    type="number"
                                    className='input'
                                    name="credit"
                                    value={formValues.credit}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>Яратиладиган иш ўрни</p>
                                <input
                                    placeholder='100'
                                    type="number"
                                    className='input'
                                    name="created_positions"
                                    value={formValues.created_positions}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label className='plan-div'>
                                <p className="input-title">Жорий йилда амалга оширилган экспорт хажми (минг. долл)</p>
                                <div className="reja_amal">
                                    <label className='reja'>
                                        <p className='input-title'>режа</p>
                                        <input
                                            placeholder='2021'
                                            type="number"
                                            className="input"
                                            name="export_plan"
                                            value={formValues.export_plan}
                                            onChange={handleFormInputChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                    <label className='reja'>
                                        <p className='input-title'>амалда</p>
                                        <input
                                            placeholder='01'
                                            type="number"
                                            className="input"
                                            name="export_actual"
                                            value={formValues.export_actual}
                                            onChange={handleFormInputChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                </div>
                            </label>
                            <label>
                                <p className='input-title'>Лойиҳа ҳолати (Амалга оширилмоқда / Ишга тушган)</p>
                                <input
                                    placeholder='Амалга оширилмоқда'
                                    type="text"
                                    className='input'
                                    name="status"
                                    value={formValues.status}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>Шундан: Лойиҳа бўйича 2025 йилда ўзлаштирилган маблағ (млн сўм)</p>
                                <input
                                    placeholder='80'
                                    type="number"
                                    className='input'
                                    name="ozlashtirilgan"
                                    value={formValues.ozlashtirilgan}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label className='plan-div'>
                                <p className="photo-section-title">Ишга тушиш муддати</p>
                                <div className="reja_amal">
                                    <label className='reja'>
                                        <p className='input-title'>йил</p>
                                        <input
                                            placeholder='2021'
                                            type="number"
                                            className="input"
                                            name="launch_year"
                                            value={formValues.launch_year}
                                            onChange={handleFormInputChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                    <label className='reja'>
                                        <p className='input-title'>ой</p>
                                        <input
                                            placeholder='01'
                                            type="number"
                                            className="input"
                                            name="launch_month"
                                            value={formValues.launch_month}
                                            onChange={handleFormInputChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                </div>
                            </label>
                            <label className='plan-div'>
                                <p className="photo-section-title">КСЗга ҳудудига жойлаштирилган вақти</p>
                                <div className="reja_amal">
                                    <label className='reja'>
                                        <p className='input-title'>йил</p>
                                        <input
                                            placeholder='2019'
                                            type="number"
                                            className="input"
                                            name="placement_year"
                                            value={formValues.placement_year}
                                            onChange={handleFormInputChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                    <label className='reja'>
                                        <p className='input-title'>ой</p>
                                        <input
                                            placeholder='09'
                                            type="number"
                                            className="input"
                                            name="placement_month"
                                            value={formValues.placement_month}
                                            onChange={handleFormInputChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                </div>
                            </label>
                        </div>

                        <div className="form-right">
                            <label>
                                <p className='input-title'>Лойиҳа номи</p>
                                <input
                                    placeholder='Сутни қайта ишлаш ва кондитер махсулотларини ишлаб чиқариш'
                                    type="text"
                                    className='input'
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>КСЗ номи</p>
                                <input
                                    placeholder='Даштбоғ КСЗ'
                                    type="text"
                                    className='input'
                                    name="ksz_name"
                                    value={formValues.ksz_name}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>Лойиҳа ташаббускори</p>
                                <input
                                    placeholder='"VODIY CANDY MILK" MЧЖ'
                                    type="text"
                                    className='input'
                                    name="initiator"
                                    value={formValues.initiator}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>Ажратилган ер майдони (га)</p>
                                <input
                                    placeholder='0.15'
                                    type="number"
                                    className='input'
                                    name="land"
                                    value={formValues.land}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>ўз маблағи (млн. сўм)</p>
                                <input
                                    placeholder='8250'
                                    type="number"
                                    className='input'
                                    name="uz_mablagi"
                                    value={formValues.uz_mablagi}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>чет эл инвестицияси (минг долл.)</p>
                                <input
                                    placeholder='1'
                                    type="number"
                                    className='input'
                                    name="foreign_invest"
                                    value={formValues.foreign_invest}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>Хизмат кўрсатувчи банк</p>
                                <input
                                    placeholder='"МИКРОКРЕДИТБАНК" АТ БАНКИ'
                                    type="text"
                                    className='input'
                                    name="bank"
                                    value={formValues.bank}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>Жорий йилда амалда ишлаб чиқарилган хажм (млн. сўм)</p>
                                <input
                                    placeholder='3100'
                                    type="number"
                                    className='input'
                                    name="current_volume"
                                    value={formValues.current_volume}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label>
                                <p className='input-title'>Жорий йилда амалга оширилган импорт хажми (минг. долл)</p>
                                <input
                                    placeholder='2'
                                    type="number"
                                    className='input'
                                    name="import_volume"
                                    value={formValues.import_volume}
                                    onChange={handleFormInputChange}
                                    disabled={!isEditable}
                                />
                            </label>
                            <label className='plan-div'>
                                <p className="photo-section-title">Ишга тушиш вақти</p>
                                <div className="reja_amal">
                                    <label className='reja'>
                                        <p className='input-title'>йил</p>
                                        <input
                                            placeholder='2021'
                                            type="number"
                                            className="input"
                                            name="launch_year_2"
                                            value={formValues.launch_year_2}
                                            onChange={handleFormInputChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                    <label className='reja'>
                                        <p className='input-title'>ой</p>
                                        <input
                                            placeholder='01'
                                            type="number"
                                            className="input"
                                            name="launch_month_2"
                                            value={formValues.launch_month_2}
                                            onChange={handleFormInputChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                </div>
                            </label>

                            {/* Saqlash tugmasi faqat admin uchun */}
                            {isAdmin && (
                                <div className="edit-btn-div">
                                    <button
                                        className='edit-btn'
                                        type="button"
                                        onClick={handleSave}
                                        style={{
                                            cursor: isEditable ? 'pointer' : 'not-allowed',
                                            opacity: isEditable ? 1 : 0.6
                                        }}
                                        disabled={!isEditable || isSubmitting}
                                    >
                                        <FiEdit fontSize={20} />
                                        {isSubmitting ? "Сақланилмоқда..." : "Маълумотларни сақлаш"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>

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

                        <form onSubmit={handleLoginSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={loginFormData.email}
                                    onChange={handleLoginInputChange}
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
                                    value={loginFormData.password}
                                    onChange={handleLoginInputChange}
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
