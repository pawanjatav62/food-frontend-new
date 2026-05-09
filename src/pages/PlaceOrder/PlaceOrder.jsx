import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {

  const { getTotalCartAmount, url, cartItems, food_list } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  // ✅ input handle
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ cart → order items
  const getOrderItems = () => {
    let orderItems = [];

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find(product => product._id === item);

        if (itemInfo) {
          orderItems.push({
            name: itemInfo.name,
            price: itemInfo.price,
            quantity: cartItems[item]
          });
        }
      }
    }

    return orderItems;
  };

  // ✅ payment handler
  const handlePayment = async (e) => {
    e.preventDefault();

    const orderItems = getOrderItems();

    // 🚫 empty cart check
    if (orderItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/order/place",
        {
          // ❌ userId हटाया
          items: orderItems,
          amount: getTotalCartAmount(),
          address: data
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      console.log("ORDER RESPONSE:", response.data);

      if (response.data.success) {
        // ✅ Stripe redirect
        window.location.href = response.data.session_url;
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      alert("Error placing order");
    }
  };

  return (
    <form className='place-order' onSubmit={handlePayment}>

      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input name='firstName' value={data.firstName} onChange={onChangeHandler} type="text" placeholder='First Name' required />
          <input name='lastName' value={data.lastName} onChange={onChangeHandler} type="text" placeholder='Last Name' required />
        </div>

        <input name='email' value={data.email} onChange={onChangeHandler} type="email" placeholder='Email address' required />
        <input name='street' value={data.street} onChange={onChangeHandler} type="text" placeholder='Street' required />

        <div className="multi-fields">
          <input name='city' value={data.city} onChange={onChangeHandler} type="text" placeholder='City' required />
          <input name='state' value={data.state} onChange={onChangeHandler} type="text" placeholder='State' required />
        </div>

        <div className="multi-fields">
          <input name='zipcode' value={data.zipcode} onChange={onChangeHandler} type="text" placeholder='Zip code' required />
          <input name='country' value={data.country} onChange={onChangeHandler} type="text" placeholder='Country' required />
        </div>

        <input name='phone' value={data.phone} onChange={onChangeHandler} type="text" placeholder='Phone' required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder;