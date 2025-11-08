import React from 'react'
import "./Page.css";
import { BiSolidPhoneCall, BiSolidEnvelope } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
function Contact() {
  return (
    <div className='container'>
        <div className='contact'>
                  <div className="container">
                    <div className="contact__page">
                      <div className="contact__page-img">
                        <div className="contact__text">
                          <div className="contact__text-top">
                            <h2>Контактная информация</h2>
                            <span>Отправьте свои данные для связи</span>
                          </div>
                          <ul className='items'>
                            <li className='item'>
                              <BiSolidPhoneCall className='item__icon' />
                              +1012 3456 789
                            </li>
                            <li className='item'>
                              <BiSolidEnvelope className='item__icon' />
                              demo@gmail.com
                            </li>
                            <li className='item'>
                              <FaLocationDot className='item__icon' />
                              132 Dartmouth Street Boston, Massachusetts 02156 United States
                            </li>
                          </ul>
                          <ul className="socials">
                            <li className="social">
                              <FaTwitter />
                            </li>
                            <li className="social">
                              <FaInstagram />
                            </li>
                            <li className="social">
                              <FaDiscord />
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="contact__form">
                        <form>
                          <label>
                            <span>Имя</span>
                            <input type="text" />
                          </label>
                          <label>
                            <span>Фамилия</span>
                            <input placeholder='Doe' type="text" />
                          </label>
                          <label>
                            <span>Электронная почта</span>
                            <input type="email" />
                          </label>
                          <label>
                            <span>Номер телефона</span>
                            <input placeholder='+1 012 3456 789' type="tel" />
                          </label>
                          <label className='message'>
                            <span>Сообщение</span>
                            <input placeholder='Напишите своё сообщение..' type="text" />
                          </label>
        
                          <div className="contact__button">
                            <button>
                              Отправить сообщение
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
    </div>
  )
}

export default Contact