import React, { useRef, useState, useEffect } from 'react';
import './UniqueEdit.css';
import { FiUpload, FiEdit } from "react-icons/fi";
import { LuImage } from "react-icons/lu";
import axios from 'axios';
import { useParams } from "react-router-dom";

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
        sanoat_zona: "",
        STIR: "",
        cost: "",
        credit: "",
        ish_urni_planned: "",
        ish_urni_real: "",
        export_volume_planned: "",
        export_volume_real: "",
        loyiha_holati: "",
        ozlashtirilgan_mublag: "",
        start_date: "",
        ksz_placement_date: "",
        loyiha_nomi: "",
        ksz_nomi: "",
        tashabbuskori: "",
        land: "",
        uz_mablagi: "",
        foreign_investments: "",
        hizmat_bank: "",
        current_volume_per_year_planned: "",
        current_volume_per_year_real: "",
        current_volume_per_month: "",
        current_import_volume_per_year: "",
        reduced_cost: ""
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
        const interval = setInterval(checkAdminSession, 10_000);
        return () => clearInterval(interval);
    }, []);

    // MChJ ma'lumotlarini yuklash
    useEffect(() => {
        const fetchMchjData = async () => {
            if (!id) {
                setMessage("MChJ ID topilmadi");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await axios.get(`https://qwertyuiop999.pythonanywhere.com/api/mchj/${id}/`);
                const data = res.data;

                setMchjData(data);

                setFormValues({
                    sanoat_zona: data.sanoat_zona || "",
                    STIR: data.STIR || "",
                    cost: data.cost || "",
                    credit: data.credit || "",
                    ish_urni_planned: data.ish_urni_planned || "",
                    ish_urni_real: data.ish_urni_real || "",
                    export_volume_planned: data.export_volume_planned || "",
                    export_volume_real: data.export_volume_real || "",
                    loyiha_holati: data.loyiha_holati || "",
                    ozlashtirilgan_mublag: data.ozlashtirilgan_mublag || "",
                    start_date: data.start_date || "",
                    ksz_placement_date: data.ksz_placement_date || "",
                    loyiha_nomi: data.loyiha_nomi || "",
                    ksz_nomi: data.ksz_nomi || "",
                    tashabbuskori: data.tashabbuskori || "",
                    land: data.land || "",
                    uz_mablagi: data.uz_mablagi || "",
                    foreign_investments: data.foreign_investments || "",
                    hizmat_bank: data.hizmat_bank || "",
                    current_volume_per_year_planned: data.current_volume_per_year_planned || "",
                    current_volume_per_year_real: data.current_volume_per_year_real || "",
                    current_volume_per_month: data.current_volume_per_month || "",
                    current_import_volume_per_year: data.current_import_volume_per_year || "",
                    reduced_cost: data.reduced_cost || ""
                });
            } catch (err) {
                console.error(err);
                setMessage(`Ma'lumot yuklanmadi: ${err.response?.data?.detail || err.message}`);
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
        if (!isEditable || !id) {
            alert("Ruxsat yo'q yoki ID topilmadi!");
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.patch(`https://qwertyuiop999.pythonanywhere.com/api/mchj/${id}/`, formValues);
            alert("Ma'lumotlar muvaffaqiyatli yangilandi!");

            const res = await axios.get(`https://qwertyuiop999.pythonanywhere.com/api/mchj/${id}/`);
            setMchjData(res.data);
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
                            ) : mchjData?.image ? (
                                <img src={mchjData.image} alt="MChJ" className="preview-image" />
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
                            <label><p className='input-title'>Саноат зона</p>
                                <input type="text" className='input' name="sanoat_zona" value={formValues.sanoat_zona} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>СТИР</p>
                                <input type="number" className='input' name="STIR" value={formValues.STIR} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Лойиҳа умумий қиймати (млн. сўм)</p>
                                <input type="number" className='input' name="cost" value={formValues.cost} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Банк кредити (млн. сўм)</p>
                                <input type="number" className='input' name="credit" value={formValues.credit} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Иш ўринлари (режали)</p>
                                <input type="number" className='input' name="ish_urni_planned" value={formValues.ish_urni_planned} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Иш ўринлари (амалда)</p>
                                <input type="number" className='input' name="ish_urni_real" value={formValues.ish_urni_real} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label className='plan-div'><p className="input-title">Экспорт ҳажми (минг долл)</p>
                                <div className="reja_amal">
                                    <label className='reja'><p className='input-title'>режа</p>
                                        <input type="number" className="input" name="export_volume_planned" value={formValues.export_volume_planned} onChange={handleFormInputChange} disabled={!isEditable} />
                                    </label>
                                    <label className='reja'><p className='input-title'>амалда</p>
                                        <input type="number" className="input" name="export_volume_real" value={formValues.export_volume_real} onChange={handleFormInputChange} disabled={!isEditable} />
                                    </label>
                                </div>
                            </label>
                            <label><p className='input-title'>Лойиҳа ҳолати</p>
                                <input type="text" className='input' name="loyiha_holati" value={formValues.loyiha_holati} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Ўзлаштирилган маблағ (млн сўм)</p>
                                <input type="number" className='input' name="ozlashtirilgan_mublag" value={formValues.ozlashtirilgan_mublag} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Ишга тушиш санаси</p>
                                <input type="text" className='input' name="start_date" value={formValues.start_date} onChange={handleFormInputChange} disabled={!isEditable} placeholder="2024-03-01" />
                            </label>
                            <label><p className='input-title'>КСЗга жойлаштирилган сана</p>
                                <input type="text" className='input' name="ksz_placement_date" value={formValues.ksz_placement_date} onChange={handleFormInputChange} disabled={!isEditable} placeholder="2024-04-10" />
                            </label>
                        </div>

                        <div className="form-right">
                            <label><p className='input-title'>Лойиҳа номи</p>
                                <input type="text" className='input' name="loyiha_nomi" value={formValues.loyiha_nomi} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>КСЗ номи</p>
                                <input type="text" className='input' name="ksz_nomi" value={formValues.ksz_nomi} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Лойиҳа ташаббускори</p>
                                <input type="text" className='input' name="tashabbuskori" value={formValues.tashabbuskori} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Ажратилган ер майдони (га)</p>
                                <input type="number" step="0.01" className='input' name="land" value={formValues.land} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Ўз маблағи (млн. сўм)</p>
                                <input type="number" className='input' name="uz_mablagi" value={formValues.uz_mablagi} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Чет эл инвестицияси (минг долл.)</p>
                                <input type="number" className='input' name="foreign_investments" value={formValues.foreign_investments} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Хизмат кўрсатувчи банк</p>
                                <input type="text" className='input' name="hizmat_bank" value={formValues.hizmat_bank} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Йиллик ишлаб чиқариш (режали)</p>
                                <input type="number" className='input' name="current_volume_per_year_planned" value={formValues.current_volume_per_year_planned} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Йиллик ишлаб чиқариш (амалда)</p>
                                <input type="number" className='input' name="current_volume_per_year_real" value={formValues.current_volume_per_year_real} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>
                            <label><p className='input-title'>Импорт хажми (минг долл.)</p>
                                <input type="number" className='input' name="current_import_volume_per_year" value={formValues.current_import_volume_per_year} onChange={handleFormInputChange} disabled={!isEditable} />
                            </label>

                            {isAdmin && (
                                <div className="edit-btn-div">
                                    <button className='edit-btn' type="button" onClick={handleSave} disabled={isSubmitting}>
                                        <FiEdit fontSize={20} />
                                        {isSubmitting ? "Сақланилмоқда..." : "Маълумотларни сақлаш"}
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

export default UniqueEdit;
