import React, { useRef, useState, useEffect } from "react";
import "./UniqueEdit.css";
import { FiUpload, FiEdit } from "react-icons/fi";
import { LuImage } from "react-icons/lu";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UniqueEdit() {
    const navigate = useNavigate();

    // STATE
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
    const [, setDistrictsLoading] = useState(true);

    const fileInputRef = useRef(null);

    const initialForm = {
        name: "",
        description: "",
        district: "",
        sanoat_zona: "",
        STIR: "0",
        cost: "0",
        credit: "0",
        ish_urni_planned: "0",
        ish_urni_real: "0",
        export_volume_planned: "0",
        export_volume_real: "0",
        ozlashtirilgan_mublag: "0",
        start_date: "",
        ksz_placement_date: "",
        loyiha_nomi: "",
        ksz_nomi: "",
        tashabbuskori: "",
        land: "0",
        uz_mablagi: "0",
        foreign_investments: "0",
        hizmat_bank: "",
        current_volume_per_year_planned: "0",
        current_volume_per_year_real: "0",
        current_volume_per_month: "0",
        current_import_volume_per_year: "0",
        reduced_cost: "0",
        created_positions: "0",
        loyiha_holati: "MALE", // Backendda ishlaydigan default qiymat
    };
    const [formValues, setFormValues] = useState(initialForm);

    // ADMIN CHECK
    useEffect(() => {
        const check = () => {
            const saved = localStorage.getItem("userCredentials");
            const loginTime = localStorage.getItem("loginTime");
            if (saved && loginTime) {
                const { email, password } = JSON.parse(saved);
                const now = Date.now();
                const oneHour = 60 * 60 * 1000;
                if (
                    email === "admin@gmail.com" &&
                    password === "admin" &&
                    now - parseInt(loginTime) < oneHour
                ) {
                    setIsAdmin(true);
                    setIsEditable(true);
                } else {
                    localStorage.removeItem("userCredentials");
                    localStorage.removeItem("loginTime");
                    setIsAdmin(false);
                    setIsEditable(false);
                }
            }
        };
        check();
        const iv = setInterval(check, 10000);
        return () => clearInterval(iv);
    }, []);

    // TUMANLAR YUKLASH
    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                setDistrictsLoading(true);
                const res = await axios.get(
                    "https://qwertyuiop999.pythonanywhere.com/api/districts/"
                );
                console.log("Tumanlar:", res.data);
                setDistricts(res.data);
            } catch (e) {
                console.error(e);
                setMessage("Tumanlar yuklanmadi");
                setMessageType("error");
            } finally {
                setDistrictsLoading(false);
                setLoading(false);
            }
        };
        fetchDistricts();
    }, []);

    // HANDLERS
    const handleImageClick = () => isEditable && fileInputRef.current?.click();

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData((p) => ({ ...p, [name]: value }));
        setMessage("");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValues((p) => ({ ...p, [name]: value }));
    };

    // LOGIN
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { email, password } = loginFormData;
        if (email === "admin@gmail.com" && password === "admin") {
            const now = Date.now();
            localStorage.setItem("userCredentials", JSON.stringify(loginFormData));
            localStorage.setItem("loginTime", now.toString());
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
            setTimeout(() => setIsSubmitting(false), 1500);
        }
    };

    const openEditModal = () => {
        setIsModalOpen(true);
        setMessage("");
    };

    // RAQAMLI QIYMATNI TO'G'RILASH
    const parseNumericValue = (value) => {
        if (value === "" || value === null || value === undefined) return 0;
        const num = parseInt(value, 10);
        return isNaN(num) ? 0 : num;
    };

    // SAQLASH - TO'G'RI QIYMATLAR BILAN
    const handleSave = async () => {
        if (!isEditable) {
            alert("Ruxsat yo'q!");
            return;
        }

        const { name, description, district } = formValues;
        if (!name || !district) {
            alert("Qishloq nomi va tumanni to'ldiring!");
            return;
        }

        const districtId = parseInt(district, 10);
        if (isNaN(districtId)) {
            alert("Tuman ID noto'g'ri!");
            return;
        }

        try {
            setIsSubmitting(true);

            // 1. MChJ ma'lumotlarini tayyorlash
            const mchjData = {
                sanoat_zona: formValues.sanoat_zona || "",
                STIR: parseNumericValue(formValues.STIR),
                cost: parseNumericValue(formValues.cost),
                credit: parseNumericValue(formValues.credit),
                ish_urni_planned: parseNumericValue(formValues.ish_urni_planned),
                ish_urni_real: parseNumericValue(formValues.ish_urni_real),
                export_volume_planned: parseNumericValue(formValues.export_volume_planned),
                export_volume_real: parseNumericValue(formValues.export_volume_real),
                ozlashtirilgan_mublag: parseNumericValue(formValues.ozlashtirilgan_mublag),
                start_date: formValues.start_date || null,
                ksz_placement_date: formValues.ksz_placement_date || null,
                loyiha_nomi: formValues.loyiha_nomi || "",
                ksz_nomi: formValues.ksz_nomi || "",
                tashabbuskori: formValues.tashabbuskori || "",
                land: parseNumericValue(formValues.land),
                uz_mablagi: parseNumericValue(formValues.uz_mablagi),
                foreign_investments: parseNumericValue(formValues.foreign_investments),
                hizmat_bank: formValues.hizmat_bank || "",
                current_volume_per_year_planned: parseNumericValue(formValues.current_volume_per_year_planned),
                current_volume_per_year_real: parseNumericValue(formValues.current_volume_per_year_real),
                current_volume_per_month: parseNumericValue(formValues.current_volume_per_month),
                current_import_volume_per_year: parseNumericValue(formValues.current_import_volume_per_year),
                reduced_cost: parseNumericValue(formValues.reduced_cost),
                created_positions: parseNumericValue(formValues.created_positions),
                loyiha_holati: formValues.loyiha_holati, // Backendga mos qiymat
            };

            console.log("MChJ yaratilmoqda...", mchjData);

            // 2. MChJ yaratish
            const mchjFormData = new FormData();
            Object.entries(mchjData).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    mchjFormData.append(key, value);
                }
            });

            if (fileInputRef.current?.files?.[0]) {
                mchjFormData.append("image", fileInputRef.current.files[0]);
            }

            const mchjRes = await axios.post(
                "https://qwertyuiop999.pythonanywhere.com/api/mchj/",
                mchjFormData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            );
            const mchjId = mchjRes.data.id;
            console.log("MChJ yaratildi, ID:", mchjId);

            // 3. Yangi qishloq yaratish
            const villageData = {
                name: name.trim(),
                description: description.trim(),
                district: districtId,
                MChJlar: [mchjId]
            };

            const newVillageRes = await axios.post(
                "https://qwertyuiop999.pythonanywhere.com/api/villages/",
                villageData
            );
            console.log("Qishloq yaratildi:", newVillageRes.data);

            alert("Muvaffaqiyatli saqlandi!");
            navigate("/");

        } catch (err) {
            console.error("Xato:", err);
            let errorMsg = "Noma'lum xato";

            if (err.response?.data) {
                const data = err.response.data;
                console.log("Backend xatosi:", data);

                if (data.loyiha_holati) {
                    // Backendda qanday qiymatlar qabul qilinishini tekshirish uchun
                    errorMsg = `Loyiha holati xatosi: ${data.loyiha_holati.join(', ')}\n\nBackend quyidagi qiymatlarni qabul qiladi:\n- MALE\n- FEMALE\n- OTHER`;
                } else if (data.name && data.name.includes('already exists')) {
                    errorMsg = `"${name}" nomi ushbu tumanda allaqachon mavjud. Boshqa nom kiriting.`;
                } else if (typeof data === 'object') {
                    errorMsg = Object.entries(data)
                        .map(([k, v]) => {
                            if (Array.isArray(v)) {
                                return `${k}: ${v.join(', ')}`;
                            } else if (typeof v === 'object') {
                                return `${k}: ${JSON.stringify(v)}`;
                            } else {
                                return `${k}: ${v}`;
                            }
                        })
                        .join('\n');
                } else {
                    errorMsg = String(data);
                }
            } else if (err.request) {
                errorMsg = "Serverga ulanib bo'lmadi. Internet aloqasini tekshiring.";
            } else {
                errorMsg = err.message;
            }

            alert(`Xato:\n${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // RENDER
    if (loading) {
        return (
            <div className="uniqueEdit">
                <div className="container" style={{ textAlign: "center", padding: 40 }}>
                    <div className="loading-spinner" />
                    <p>Ma'lumotlar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="uniqueEdit">
            <div className="container">
                {/* XABAR */}
                {message && (
                    <div
                        style={{
                            margin: "20px 0",
                            padding: 15,
                            borderRadius: 10,
                            textAlign: "center",
                            fontWeight: 600,
                            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                            color: messageType === "success" ? "#155724" : "#721c24",
                            border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                        }}
                    >
                        {message}
                    </div>
                )}

                {/* RASIM */}
                <h2 className="photo-section-title">Лавҳа сурати</h2>
                <div className="photo-section">
                    <div className="form_photo">
                        <div
                            className="photo-box"
                            onClick={handleImageClick}
                            style={{
                                cursor: isEditable ? "pointer" : "not-allowed",
                                opacity: isEditable ? 1 : 0.7,
                            }}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="preview" className="preview-image" />
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
                                disabled={!isEditable}
                            >
                                <LuImage /> Сурат юклаш
                            </button>
                        </div>
                    </div>

                    <button className="edit-btn" onClick={openEditModal}>
                        <FiEdit fontSize={20} /> Маълумотларни таҳрирлаш
                    </button>
                </div>

                {/* FORM */}
                <div className="form-div">
                    <h2 className="photo-section-title">Умумий маълумот</h2>
                    <form className="form">
                        <div className="form-left">
                            {/* TUMAN */}
                            <label>
                                <span className="input-title">Шаҳар-туман номи</span>
                                <select
                                    className="input"
                                    name="district"
                                    value={formValues.district}
                                    onChange={handleFormChange}
                                    disabled={!isEditable}
                                >
                                    <option value="">Танланг</option>
                                    {districts.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* QISHLOQ NOMI */}
                            <label>
                                <p className="input-title">Қишлоқ номи</p>
                                <input
                                    type="text"
                                    className="input"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleFormChange}
                                    disabled={!isEditable}
                                    placeholder="Yangi Qishloq"
                                />
                            </label>

                            {/* TAVSIF */}
                            <label>
                                <p className="input-title">Тавсиф</p>
                                <input
                                    type="text"
                                    className="input"
                                    name="description"
                                    value={formValues.description}
                                    onChange={handleFormChange}
                                    disabled={!isEditable}
                                />
                            </label>

                            {/* LOYIHA HOLATI - BACKENDGA MOS QIYMATLAR */}
                            <label>
                                <p className="input-title">Лойиҳа ҳолати</p>
                                <select
                                    className="input"
                                    name="loyiha_holati"
                                    value={formValues.loyiha_holati}
                                    onChange={handleFormChange}
                                    disabled={!isEditable}
                                    required
                                >
                                    <option value="MALE">Режалаштирилган</option>
                                    <option value="FEMALE">Амалга оширилган</option>
                                    <option value="OTHER">Тугатилган</option>
                                </select>
                            </label>

                            {/* ASOSIY RAQAMLI MAYDONLAR */}
                            {[
                                { label: "СТИР", name: "STIR" },
                                { label: "Лойиҳа умумий қиймати (млн. сўм)", name: "cost" },
                                { label: "Банк кредити (млн. сўм)", name: "credit" },
                                { label: "Иш ўринлари (режали)", name: "ish_urni_planned" },
                                { label: "Иш ўринлари (амалда)", name: "ish_urni_real" },
                                { label: "Ўзлаштирилган маблағ (млн сўм)", name: "ozlashtirilgan_mublag" },
                                { label: "Ажратилган ер майдони (га)", name: "land", step: "0.01" },
                            ].map((f) => (
                                <label key={f.name}>
                                    <p className="input-title">{f.label}</p>
                                    <input
                                        type="number"
                                        step={f.step || "1"}
                                        min="0"
                                        className="input"
                                        name={f.name}
                                        value={formValues[f.name]}
                                        onChange={handleFormChange}
                                        disabled={!isEditable}
                                        placeholder="0"
                                    />
                                </label>
                            ))}

                            {/* EKSPORT */}
                            <label className="plan-div">
                                <p className="input-title">Экспорт ҳажми (минг долл)</p>
                                <div className="reja_amal">
                                    <label className="reja">
                                        <p className="input-title">режа</p>
                                        <input
                                            type="number"
                                            step="1"
                                            min="0"
                                            className="input"
                                            name="export_volume_planned"
                                            value={formValues.export_volume_planned}
                                            onChange={handleFormChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                    <label className="reja">
                                        <p className="input-title">амалда</p>
                                        <input
                                            type="number"
                                            step="1"
                                            min="0"
                                            className="input"
                                            name="export_volume_real"
                                            value={formValues.export_volume_real}
                                            onChange={handleFormChange}
                                            disabled={!isEditable}
                                        />
                                    </label>
                                </div>
                            </label>

                            {/* SANA */}
                            <label>
                                <p className="input-title">Ишга тушиш санаси</p>
                                <input
                                    type="date"
                                    className="input"
                                    name="start_date"
                                    value={formValues.start_date}
                                    onChange={handleFormChange}
                                    disabled={!isEditable}
                                />
                            </label>

                            <label>
                                <p className="input-title">КСЗга жойлаштирилган сана</p>
                                <input
                                    type="date"
                                    className="input"
                                    name="ksz_placement_date"
                                    value={formValues.ksz_placement_date}
                                    onChange={handleFormChange}
                                    disabled={!isEditable}
                                />
                            </label>
                        </div>

                        <div className="form-right">
                            {/* TEXT MAYDONLAR */}
                            {[
                                { label: "Лойиҳа номи", name: "loyiha_nomi" },
                                { label: "КСЗ номи", name: "ksz_nomi" },
                                { label: "Лойиҳа ташаббускори", name: "tashabbuskori", required: true },
                                { label: "Хизмат кўрсатувчи банк", name: "hizmat_bank", required: true },
                                { label: "Саноат зона", name: "sanoat_zona" },
                            ].map((f) => (
                                <label key={f.name}>
                                    <p className="input-title">{f.label}</p>
                                    <input
                                        type="text"
                                        className="input"
                                        name={f.name}
                                        value={formValues[f.name]}
                                        onChange={handleFormChange}
                                        disabled={!isEditable}
                                        required={f.required}
                                        placeholder={f.required ? "Majburiy" : ""}
                                    />
                                </label>
                            ))}

                            {/* QO'SHIMCHA RAQAMLI MAYDONLAR */}
                            {[
                                { label: "Ўз маблағи (млн. сўм)", name: "uz_mablagi" },
                                { label: "Чет эл инвестицияси (минг долл.)", name: "foreign_investments" },
                                { label: "Йиллик ишлаб чиқариш (режали)", name: "current_volume_per_year_planned" },
                                { label: "Йиллик ишлаб чиқариш (амалда)", name: "current_volume_per_year_real" },
                                { label: "Ойлик ишлаб чиқариш", name: "current_volume_per_month" },
                                { label: "Импорт хажми (минг долл.)", name: "current_import_volume_per_year" },
                                { label: "Қисқартирилган харажат", name: "reduced_cost" },
                                { label: "Яратилган иш ўринлари", name: "created_positions" },
                            ].map((f) => (
                                <label key={f.name}>
                                    <p className="input-title">{f.label}</p>
                                    <input
                                        type="number"
                                        step="1"
                                        min="0"
                                        className="input"
                                        name={f.name}
                                        value={formValues[f.name]}
                                        onChange={handleFormChange}
                                        disabled={!isEditable}
                                        placeholder="0"
                                    />
                                </label>
                            ))}

                            {/* SAQLASH */}
                            {isAdmin && (
                                <div className="edit-btn-div">
                                    <button
                                        type="button"
                                        className="edit-btn"
                                        onClick={handleSave}
                                        disabled={isSubmitting || !formValues.name.trim() || !formValues.district || !formValues.loyiha_holati}
                                        style={{
                                            opacity: (isSubmitting || !formValues.name.trim() || !formValues.district || !formValues.loyiha_holati) ? 0.6 : 1,
                                            cursor: (isSubmitting || !formValues.name.trim() || !formValues.district || !formValues.loyiha_holati) ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <FiEdit fontSize={20} />
                                        {isSubmitting ? "Сақланилмоқда..." : "Маълумотларни сақлаш"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                X
                            </button>
                            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Админ кириш</h2>

                            {message && (
                                <div
                                    style={{
                                        margin: "0 0 20px",
                                        padding: "19px 18px",
                                        borderRadius: 10,
                                        fontWeight: 600,
                                        textAlign: "center",
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
                                        onChange={handleLoginChange}
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
                                        onChange={handleLoginChange}
                                        required
                                        placeholder="admin"
                                        disabled={isSubmitting}
                                    />
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
