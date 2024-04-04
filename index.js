import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.css";
import './index.css';
import items from "./product.json";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";

function App(){
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [dataF,setDataF] = useState({});
  const [viewCatalog, setViewCatalog] = useState(true);
  const [viewer,setViewer] = useState(0);

  function Shop() {
    function toCart() {
      setViewCatalog(!viewCatalog);
    }

    useEffect(() => {
        total();
    }, [cart]);

    const total = () => {
        let totalVal = 0;
        for (let i = 0; i < cart.length; i++) {
            totalVal += cart[i].price;
        }
        setCartTotal(totalVal);
    };

    const addToCart = (el) => {
        setCart([...cart, el]);
    };

    const removeFromCart = (el) => {
      let itemFound = false;
      const updatedCart = cart.filter((cartItem) => {
          if (cartItem.id === el.id && !itemFound) {
              itemFound = true;
              return false;
          }
              return true;
      });
      if (itemFound) {
          setCart(updatedCart);
      }
    };

    const cartItems = cart.map((el) => (
        <div key={el.id} class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <div class="col">
                <img class="img-fluid" src={el.image} width={150} />
            </div>
            <div class="col">
                {el.title}
            </div>
            <div class="col">
                ${el.price}
            </div>
        </div>
    ));

    function howManyofThis(id) {
        let hmot = cart.filter((cartItem) => cartItem.id === id);
        return hmot.length;
    }

    const listItems = cart.map((el) => (
      <div class="col" key={el.id}>
          <div class="card shadow-sm">
              <img src={el.image} width="100%" alt="image" />
              <div class="card-body">
                  <p class="card-text"><strong>{el.title}</strong></p>
                  <p class="card-text">{el.description}</p>
                  <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                          <button class="mx-1" type="button" variant="light" onClick={() => removeFromCart(el)} > - </button>{" "}
                          <button class="mx-1" type="button" variant="light" onClick={() => addToCart(el)}> + </button>
                          ${el.price} <span class="close">&#10005;</span>{howManyofThis(el.id)}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    ));

    return(
        <div>
          <header data-bs-theme="dark">
            <div id="navbarHeader">
              <div class="container">
                <div class="row">
                  <div class="col-sm-8 col-md-7 py-4">
                    <h2>Outdoor Emporium: Browse</h2>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>
    );
  }

  function Payment() {
    return(
      <div>
        <header data-bs-theme="dark">
          <div id="navbarHeader">
            <div class="container">
              <div class="row">
                <div class="col-sm-8 col-md-7 py-4">
                  <h2>Outdoor Emporium: Payment and Cart</h2>
                </div>
              </div>
            </div>
          </div>
        </header>
        <button></button>
      </div>
    );
  }

  function Summary() {
    return(
      <div>
        <header data-bs-theme="dark">
          <div id="navbarHeader">
            <div class="container">
              <div class="row">
                <div class="col-sm-8 col-md-7 py-4">
                  <h2>Outdoor Emporium: Summary</h2>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }

  return(<div>
    {viewer === 0 && <Shop />}
    {viewer === 1 && <Payment />}
    {viewer === 2 && <Summary />}
  </div>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

