import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.css";
import './index.css';
import items from "./product.json";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";

function App(){
  function Shop() {
    
  }
  function Cart() {

  }
  function Payment() {

  }
  function Summary() {

  }
  return(<div>
    {viewer === 0 && <Shop />}
    {viewer === 1 && <Cart />}
    {viewer === 2 && <Payment />}
    {viewer === 3 && <Summary />}
  </div>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

