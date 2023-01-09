import React from "react";
import {BrowserRouter, Routes ,  Route} from "react-router-dom";
import Login from "../pages/Login";
import Menu from "../pages/Menu";
import AdminForm from "../pages/AdminForm";
import Simulador from "../pages/Simulador"

function App() {

  return(
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/menu" element={<Menu/>} />
        <Route exact path="/adminform" element={<AdminForm/>} />
        <Route exact path="/" element={<Simulador/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
