// src/components/Map.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Map.css";
import mapImage from "../assets/123.svg";
import { IoLocationSharp } from "react-icons/io5";

export default function Map() {
  const [hovered, setHovered] = useState(null);

  const districts = [
    { id: 1, name: "Pop", slog: "pop" },
    { id: 2, name: "Chust", slog: "chust" },
    { id: 3, name: "Kosonsoy", slog: "kosonsoy" },
    { id: 4, name: "Turakurg'on", slog: "turakurgon" },
    { id: 5, name: "Namangan tuman", slog: "namangan-tuman" },
    { id: 6, name: "Mingbuloq", slog: "mingbuloq" },
    { id: 7, name: "Davlatobod", slog: "davlatobod" },
    { id: 8, name: "Yangiqoʻrgʻon", slog: "yangiqorgon" },
    { id: 9, name: "Namangan sh", slog: "namangan-sh" },
    { id: 10, name: "Yangi Namangan", slog: "yangi-namangan" },
    { id: 11, name: "Chortoq", slog: "chortoq" },
    { id: 12, name: "Uchqoʻrgʻon", slog: "uchqorgon" },
    { id: 13, name: "Uychi", slog: "uychi" },
    { id: 14, name: "Norin", slog: "norin" },
  ];

  return (
    <div className="container">
      <div className="map-wrapper">
        <div className="map-container">
          <img src={mapImage} alt="Namangan map" className="map-image" />

          {districts.map((d) => (
            <Link
              key={d.id}
              to={`/district/${d.slog}`}
              className={`district ${hovered === d.id ? "active" : ""}`}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                opacity: hovered && hovered !== d.id ? 0.35 : 1,
                transform: hovered === d.id ? "translateY(-6px) scale(1.08)" : "none",
              }}
            >
              <div className="d1">
                <IoLocationSharp className="icon" />
                <span className="district-text">{d.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
