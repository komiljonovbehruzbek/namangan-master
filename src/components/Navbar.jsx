// components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Components.css";
import Logo from "../assets/photo_2025-11-04_15-33-59.jpg";
import FlagEN from "../assets/photo_2025-11-04_15-34-09.jpg";
import FlagUZ from "../assets/photo_2025-11-04_15-34-06.jpg";
import FlagRU from "../assets/photo_2025-11-04_15-34-03.jpg";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaBars } from "react-icons/fa"; // Hamburger qo'shildi
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false); // Dropdown
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu
  const dropdownRef = useRef(null);

  const languages = [
    { code: "UZ", flag: FlagUZ },
    { code: "RU", flag: FlagRU },
    { code: "EN", flag: FlagEN },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[1];

  const handleSelect = (code) => {
    setLanguage(code);
    setOpen(false);
  };

  // Dropdown tashqarida bosilganda yopish
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mobile menu yopilganda til o'zgarsa ham yangilansin
  useEffect(() => {
    // Til o'zgarganda mobile menu ochiq bo'lsa ham yangilansin
  }, [language]);

  return (
    <div className="navbar">
      <div className="container nav">
        {/* LOGO */}
        <div className="nav_logo">
          <Link to="/" className="link">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        {/* CENTER LINKS (Desktop + Mobile) */}
        <div className={`nav_center ${menuOpen ? "open" : ""}`}>
          <ul className="nav_center_ul">
            <li>
              <Link to="/" className="link" onClick={() => setMenuOpen(false)}>
                {t("nav_home")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="link" onClick={() => setMenuOpen(false)}>
                {t("nav_about")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="link" onClick={() => setMenuOpen(false)}>
                {t("nav_contact")}
              </Link>
            </li>
          </ul>
        </div>

<div className="nav_icon">

        {/* LANGUAGE DROPDOWN */}
        <div className="nav_lan" ref={dropdownRef}>
          <div className="lang-selector" onClick={() => setOpen(!open)}>
            <img src={currentLang.flag} alt={language} className="flag-icon" />
            <span className="lang-code">{language}</span>
            <MdOutlineArrowDropDown
              className={`arrow_i ${open ? "open" : ""}`}
            />
          </div>

          {open && (
            <div className="lang-dropdown">
              {languages
                .filter((lang) => lang.code !== language)
                .map((lang) => (
                  <div
                    key={lang.code}
                    className="lang-option"
                    onClick={() => handleSelect(lang.code)}
                  >
                    <img src={lang.flag} alt={lang.code} className="flag-icon" />
                    <span>{lang.code}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* HAMBURGER BUTTON (Mobile only) */}
        <div
          className="nav_bars"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </div>
</div>
      </div>
    </div>
  );
}

export default Navbar;