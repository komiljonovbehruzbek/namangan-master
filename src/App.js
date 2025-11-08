// App.jsx (Yangilangan: To'g'ri route'lar)
import './App.css';
import { LanguageProvider } from './context/LanguageContext';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ArticlePage from './router/ArticlePage';
import Home from './router/Home';
import { Routes, Route } from "react-router-dom";
import ProfileForm from './router/ProfileForm';
import VacanciesTable from "./router/VacanciesTable";
import DistrictVillages from './router/DistrictVillages'; // Tumanlar ro'yxati
import UnicPage from './router/UnicPage'; // Qishloq ichi MChJ
import Contact from './router/Contact';
import UniqueEdit from './router/UniqueEdit';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<ArticlePage />} />
          <Route path='/uniquedit' element={<UniqueEdit />} />
          <Route path='/add' element={<ProfileForm />} />
          <Route path='/edit' element={<VacanciesTable />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/district/:district' element={<DistrictVillages />} /> {/* Tuman -> qishloqlar */}
          <Route path="/unicpage/:location" element={<UnicPage />} /> {/* Qishloq -> MChJ */}
        </Routes>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
