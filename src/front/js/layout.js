import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import injectContext from "./store/appContext";

// Importa todos los componentes necesarios
import Navbar from "./component/Navbar.jsx";
import Footer from "./component/Footer.jsx";
import Register from "./component/Register.jsx"; // ¡Este import faltaba!
import Login from "./component/Login.jsx";
import PageStar from "./component/PageStar.jsx";
import NewsTicker from "./component/NewsTicker.jsx";
import BolsaTicker from "./component/BolsaTicker.jsx";
import Historial from "./component/Historial.jsx";
import {Demo} from "./pages/demo";
import {Single} from "./pages/single";

// Componente que contiene la lógica de renderizado condicional
const AppContent = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Navbar />}
      {!hideLayout && <NewsTicker />}
      <Routes>
        <Route element={<Register />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<Historial />} path="/historial" />
        <Route element={<PageStar />} path="/home" />
        <Route element={<Demo />} path="/demo" />
        <Route element={<Single />} path="/single/:theid" />
        <Route element={<h1>Not found!</h1>} path="*" />
      </Routes>
      {!hideLayout && <BolsaTicker />}
      {!hideLayout && <Footer />}
    </>
  );
};

// Componente principal Layout
const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <AppContent />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);





