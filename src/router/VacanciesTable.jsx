import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiX } from "react-icons/fi";

function VacanciesTable() {
  const initialData = [
    {
      id: 1,
      name: "Поп миршикор МЧЖ",
      count: "",
      phone: "+99895 2247 22 22",
      work: "Палпок ишлаб чиқариш",
      quantity: "10",
      salary: "1 000 000",
      conditions: "автотранспорт ҳаражатлари турар жой",
    },
  ];

  const [data, setData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authData, setAuthData] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("vacanciesData") || "null");
    const savedAuth = localStorage.getItem("isAuthenticated");
    if (savedData && savedData.length > 0) {
      setData(savedData);
    } else {
      setData(initialData);
      localStorage.setItem("vacanciesData", JSON.stringify(initialData));
    }
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const saveToLocalStorage = (newData) => {
    localStorage.setItem("vacanciesData", JSON.stringify(newData));
    setData(newData);
  };

  const handleAuthSubmit = () => {
    if (authData.email === "admin@gmail.com" && authData.password === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      setShowAuthModal(false);
      setAuthError("");
      alert("Хуш келибсиз admin!");
      if (currentAction) {
        currentAction();
        setCurrentAction(null);
      }
    } else {
      setAuthError("Email yoki parol noto'g'ri!");
    }
  };

  const handleEdit = (item) => {
    if (!isAuthenticated) {
      setCurrentAction(() => () => handleEdit(item));
      setShowAuthModal(true);
      return;
    }
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (!isAuthenticated) {
      setCurrentAction(() => () => handleDelete(id));
      setShowAuthModal(true);
      return;
    }
    if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
      const newData = data.filter((item) => item.id !== id);
      saveToLocalStorage(newData);
    }
  };

  const handleEditSubmit = () => {
    const newData = data.map((item) =>
      item.id === editingItem.id ? editingItem : item
    );
    saveToLocalStorage(newData);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleAddNew = () => {
    if (!isAuthenticated) {
      setCurrentAction(() => handleAddNew);
      setShowAuthModal(true);
      return;
    }
    const newItem = {
      id: Date.now(),
      name: "Янги МЧЖ",
      count: "",
      phone: "+998",
      work: "Иш тури",
      quantity: "0",
      salary: "0",
      conditions: "Қулайликлар",
    };
    const newData = [...data, newItem];
    saveToLocalStorage(newData);
  };

  const handleDoubleClick = (item) => {
    if (isAuthenticated) {
      handleEdit(item);
    }
  };

  return (
    <div className="job_container">


      <h2 className="job_title">Мавжуд иш ўринлари</h2>
      <div className="plus">
        <div className="job_plus_i" onClick={handleAddNew}>
          +
        </div>
      </div>

      {data.map((item) => (
        <div
          className="job_table_block"
          key={item.id}
          onDoubleClick={() => handleDoubleClick(item)}
        >
          <table className="job_table">
            <thead>
              <tr>
                <th>МЧЖ номи</th>
                <th>Сони</th>
                <th>
                  <div className="job_tel">
                    <p>Тел</p>
                    <div className="job_icons">
                      <FiEdit
                        className="job_icon edit"
                        onClick={() => handleEdit(item)}
                      />
                      <FiTrash
                        className="job_icon delete"
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{item.name}</td>
                <td>{item.count}</td>
                <td>{item.phone}</td>
              </tr>
              <tr>
                <td>{item.work}</td>
                <td>{item.quantity}</td>
                <td className="job_icons"></td>
              </tr>
              <tr>
                <td>Ойлик иш ҳақи</td>
                <td>{item.salary}</td>
                <td className="job_icons"></td>
              </tr>
              <tr>
                <td>Қулайликлар</td>
                <td></td>
                <td>{item.conditions}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div className="job_pagination">1–{data.length} of {data.length}</div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="job_modal_overlay" onClick={() => setShowAuthModal(false)}>
          <div className="job_modal_content-a" onClick={(e) => e.stopPropagation()}>
            <FiX className="job_modal_close" onClick={() => setShowAuthModal(false)} />
            <h2 className="job_modal_title">Admin Panel</h2>
            <div>
              <div className="job_form_group">
                <label className="job_form_label">Email:</label>
                <input
                  type="email"
                  className="job_form_input"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  placeholder="Email:Kiriting"
                />
              </div>
              <div className="job_form_group">
                <label className="job_form_label">Password:</label>
                <input
                  type="password"
                  className="job_form_input"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  placeholder="Parol:Kiriting"
                  onKeyDown={(e) => e.key === "Enter" && handleAuthSubmit()}
                />
              </div>
              {authError && <div className="job_error">{authError}</div>}
              <button type="button" className="job_submit_btn" onClick={handleAuthSubmit}>
                Kirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="job_modal_overlay" onClick={() => setShowEditModal(false)}>
          <div className="job_modal_content" onClick={(e) => e.stopPropagation()}>
            <FiX className="job_modal_close" onClick={() => setShowEditModal(false)} />
            <h2 className="job_modal_title">Маълумотни ўзгартириш</h2>
            <div>
              <div className="job_form_group">
                <label className="job_form_label">МЧЖ номи:</label>
                <input
                  type="text"
                  className="job_form_input"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div className="job_form_group">
                <label className="job_form_label">Сони:</label>
                <input
                  type="text"
                  className="job_form_input"
                  value={editingItem.count}
                  onChange={(e) => setEditingItem({ ...editingItem, count: e.target.value })}
                />
              </div>
              <div className="job_form_group">
                <label className="job_form_label">Телефон:</label>
                <input
                  type="text"
                  className="job_form_input"
                  value={editingItem.phone}
                  onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                />
              </div>
              <div className="job_form_group">
                <label className="job_form_label">Иш тури:</label>
                <input
                  type="text"
                  className="job_form_input"
                  value={editingItem.work}
                  onChange={(e) => setEditingItem({ ...editingItem, work: e.target.value })}
                />
              </div>
              <div className="job_form_group">
                <label className="job_form_label">Миқдори:</label>
                <input
                  type="text"
                  className="job_form_input"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                />
              </div>
              <div className="job_form_group">
                <label className="job_form_label">Ойлик иш ҳақи:</label>
                <input
                  type="text"
                  className="job_form_input"
                  value={editingItem.salary}
                  onChange={(e) => setEditingItem({ ...editingItem, salary: e.target.value })}
                />
              </div>
              <div className="job_form_group">
                <label className="job_form_label">Қулайликлар:</label>
                <input
                  type="text"
                  className="job_form_input"
                  value={editingItem.conditions}
                  onChange={(e) => setEditingItem({ ...editingItem, conditions: e.target.value })}
                />
              </div>
              <button type="button" className="job_submit_btn" onClick={handleEditSubmit}>
                Сақлаш
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VacanciesTable;