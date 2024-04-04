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
  const [query, setQuery] = useState("");

  function Shop() {
    function onSubmit() {
      setViewer(1);
    }

    const handleChange = (e) => {
      setQuery(e.target.value);
      console.log(e.target.value);
      const results = items.filter(eachItem => {
          if (e.target.value === "") return cart;
          return eachItem.title.toLowerCase().includes(e.target.value.toLowerCase())
      });
      setCart(results);
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

    function howManyofThis(id) {
        let hmot = cart.filter((cartItem) => cartItem.id === id);
        return hmot.length;
    }

    const listItems = cart.map((el) => (
      <div class="col" key={el.id}>
          <div class="card shadow-sm">
              <img src={el.image} width="150" height="100" alt="image" />
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
          {viewCatalog && <div class="container">
                <div class="album py-3 bg-body-tertiary">
                    <div class="row">
                        <div class="cart">
                            <div class="title">
                                <div class="row">
                                    <div class="col mx-3">
                                        <h1>
                                            <b>Cart</b>
                                        </h1>
                                    </div>
                                    <div class="col text-center text-muted">
                                        Products selected: {cart.length}
                                    </div>
                                </div>
                                <div className="py-10">
                                    <input type="search" value={query} onChange={handleChange} />
                                </div>
                            </div>
                            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                                {listItems}
                            </div>
                        </div>
                        <div class="float-end">
                            <p class="mb-0 me-5 d-flex align-items-center">
                                <span class="small text-muted me-2">Order total:</span>
                                <span class="lead fw-normal">${cartTotal}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            }
            <div class="container py-3">
                <button onClick={onSubmit}>Check Out</button>
            </div>
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

