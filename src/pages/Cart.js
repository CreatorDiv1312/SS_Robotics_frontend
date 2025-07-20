// import React from 'react';
// import { useCart } from '../context/CartContext';
// import { Link, useNavigate } from 'react-router-dom';
// import Footer from '../components/Footer';
// import '../style/Cart.css';
// import { useTheme } from '../context/ThemeContext';

// export default function Cart() {
//   const { cart, removeFromCart, updateQty } = useCart();
//   const { darkMode } = useTheme();
//   const navigate = useNavigate();

//   // 🚚 Weight-based shipping logic
//   const calculateShipping = (weight) => {
//     if (weight <= 500) return 200;
//     if (weight <= 1000) return 400;
//     if (weight <= 1500) return 600;
//     return null; // Invalid if > 1.5kg
//   };

//   const totalWeight = cart.reduce((sum, item) => sum + (item.totalWeight || item.qty * item.weightPerUnit || 0), 0);
//   const shippingTotal = cart.reduce((sum, item) => {
//     const itemWeight = item.totalWeight || item.qty * (item.weightPerUnit || 0);
//     const shipping = calculateShipping(itemWeight);
//     return sum + (shipping || 0);
//   }, 0);

//   const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//   const total = subtotal + shippingTotal;

//   if (cart.length === 0) {
//     return (
//       <div className={`cart-page ${darkMode ? 'dark' : 'light'}`}>
//         <h2>🛒 Your cart is empty.</h2>
//         <Link to="/" style={{ color: '#00aaff', textDecoration: 'underline' }}>Shop now</Link>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className={`cart-page ${darkMode ? 'dark' : 'light'}`}>
//       <h1>🛍️ Your Cart</h1>
//       <table className="cart-table">
//         <thead>
//           <tr>
//             <th>Image</th>
//             <th>Product</th>
//             <th>Qty</th>
//             <th>Price</th>
//             <th>Weight</th>
//             <th>Shipping</th>
//             <th>Total</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cart.map(item => {
//             const totalWeight = item.qty * (item.weightPerUnit || 0);
//             const shipping = calculateShipping(totalWeight);

//             return (
//               <tr key={item._id}>
//                 <td><img src={item.image} alt={item.name} /></td>
//                 <td>{item.name}</td>
//                 <td>
//                   <input
//                     type="number"
//                     value={item.qty}
//                     min="1"
//                     max={item.stock}
//                     onChange={(e) => {
//                       const qty = parseInt(e.target.value);
//                       const totalWeight = qty * (item.weightPerUnit || 0);

//                       if (totalWeight > 1500) {
//                         alert("❌ Max allowed per item is 1.5kg");
//                         return;
//                       }

//                       updateQty(item._id, qty);
//                       item.totalWeight = totalWeight;
//                     }}
//                   />
//                 </td>
//                 <td>₹{item.price}</td>
//                 <td>{totalWeight}g</td>
//                 <td>₹{shipping}</td>
//                 <td>₹{item.price * item.qty + (shipping || 0)}</td>
//                 <td>
//                   <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>❌ Remove</button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <div className="cart-summary">
//         <p><strong>Total Weight:</strong> {totalWeight}g</p>
//         <p><strong>Shipping Charges:</strong> ₹{shippingTotal}</p>
//         <p><strong>Subtotal:</strong> ₹{subtotal}</p>
//         <h2>Total Amount: ₹{total}</h2>
//       </div>

//       <button className="checkout-btn" onClick={() => navigate('/checkout')}>
//         🚀 Proceed to Checkout
//       </button>

//       <div style={{ marginTop: '5rem' }}>
//         <Footer />
//       </div>
//     </div>
//   );
// }



// ================================ Code updated with the logic of wight factor. =================================================================
// import React from 'react';
// import { useCart } from '../context/CartContext';
// import { Link, useNavigate } from 'react-router-dom';
// import Footer from '../components/Footer';
// import '../style/Cart.css';
// import { useTheme } from '../context/ThemeContext';

// export default function Cart() {
//   const { cart, removeFromCart, updateQty, updateWeight } = useCart();
//   const { darkMode } = useTheme();
//   const navigate = useNavigate();

//   const calculateShipping = (weight) => {
//     if (weight <= 500) return 200;
//     if (weight <= 1000) return 400;
//     if (weight <= 1500) return 600;
//     return null;
//   };

//   const currentDate = new Date();

//   const totalWeight = cart.reduce((sum, item) => {
//     const wt = item.customWeight ?? item.qty * (item.weightPerUnit || 0);
//     return sum + wt;
//   }, 0);

//   const shippingTotal = cart.reduce((sum, item) => {
//     const wt = item.customWeight ?? item.qty * (item.weightPerUnit || 0);
//     const shipping = calculateShipping(wt);
//     return sum + (shipping || 0);
//   }, 0);

//   const subtotal = cart.reduce((sum, item) => {
//     const discount = parseFloat(item.discount) || 0;
//     const expiryDate = item.discountExpiry ? new Date(item.discountExpiry) : null;
//     const isDiscountActive = discount > 0 && (!expiryDate || currentDate <= expiryDate);
//     const effectivePrice = isDiscountActive ? item.price * (1 - discount / 100) : item.price;
//     return sum + effectivePrice * item.qty;
//   }, 0);

//   const total = subtotal + shippingTotal;

//   if (cart.length === 0) {
//     return (
//       <div className={`cart-page ${darkMode ? 'dark' : 'light'}`}>
//         <h2>🛒 Your cart is empty.</h2>
//         <Link to="/" style={{ color: '#00aaff', textDecoration: 'underline' }}>Shop now</Link>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className={`cart-page ${darkMode ? 'dark' : 'light'}`}>
//       <h1>🛍️ Your Cart</h1>
//       <table className="cart-table">
//         <thead>
//           <tr>
//             <th>Image</th>
//             <th>Product</th>
//             <th>Qty</th>
//             <th>Price</th>
//             <th>Weight (g)</th>
//             <th>Shipping</th>
//             <th>Total</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cart.map(item => {
//             const weight = item.customWeight ?? item.qty * (item.weightPerUnit || 0);
//             const shipping = calculateShipping(weight);

//             const discount = parseFloat(item.discount) || 0;
//             const expiryDate = item.discountExpiry ? new Date(item.discountExpiry) : null;
//             const isDiscountActive = discount > 0 && (!expiryDate || currentDate <= expiryDate);
//             const effectivePrice = isDiscountActive ? item.price * (1 - discount / 100) : item.price;
//             const totalPrice = effectivePrice * item.qty + (shipping || 0);

//             return (
//               <tr key={item._id}>
//                 <td><img src={item.image} alt={item.name} /></td>
//                 <td>{item.name}</td>
//                 <td>
//                   <input
//                     type="number"
//                     value={item.qty}
//                     min="1"
//                     max={item.stock}
//                     onChange={(e) => {
//                       const qty = parseInt(e.target.value);
//                       if ((item.customWeight ?? qty * (item.weightPerUnit || 0)) > 1500) {
//                         alert("❌ Max allowed per item is 1.5kg");
//                         return;
//                       }
//                       updateQty(item._id, qty);
//                     }}
//                   />
//                 </td>
//                 <td>
//                   {isDiscountActive ? (
//                     <span>
//                       <span className="original-price">₹{item.price}</span>{' '}
//                       <span className="discounted-price">₹{effectivePrice.toFixed(2)}</span>
//                       <br />
//                       <span className="discount-label">({discount}% OFF)</span>
//                     </span>
//                   ) : (
//                     `₹${item.price}`
//                   )}
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     placeholder={`Default: ${item.weightPerUnit * item.qty}g`}
//                     value={item.customWeight ?? ''}
//                     onChange={(e) => {
//                       const customWeight = parseFloat(e.target.value);
//                       if (customWeight > 1500) {
//                         alert("❌ Max allowed is 1.5kg");
//                         return;
//                       }
//                       updateWeight(item._id, isNaN(customWeight) ? null : customWeight);
//                     }}
//                   />
//                 </td>
//                 <td>₹{shipping}</td>
//                 <td>₹{totalPrice.toFixed(2)}</td>
//                 <td>
//                   <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>❌ Remove</button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <div className="cart-summary">
//         <p><strong>Total Weight:</strong> {totalWeight}g</p>
//         <p><strong>Shipping Charges:</strong> ₹{shippingTotal}</p>
//         <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
//         <h2>Total Amount: ₹{total.toFixed(2)}</h2>
//       </div>

//       <button className="checkout-btn" onClick={() => navigate('/checkout')}>
//         🚀 Proceed to Checkout
//       </button>

//       <div style={{ marginTop: '5rem' }}>
//         <Footer />
//       </div>
//     </div>
//   );
// }


// =================================== Code updated with the discount logic correction ======================================
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../style/Cart.css';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const calculateShipping = (weight) => {
    if (weight <= 500) return 200;
    if (weight <= 1000) return 400;
    if (weight <= 1500) return 600;
    return null;
  };

  const totalWeight = cart.reduce((sum, item) => {
    return sum + item.qty * (item.weightPerUnit || 0);
  }, 0);

  const shippingTotal = calculateShipping(totalWeight) || 0;

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  const maxShippingDiscountPercent = Math.max(...cart.map(item => parseFloat(item.discount) || 0));
  const shippingDiscount = (shippingTotal * maxShippingDiscountPercent) / 100;
  const discountedShipping = +(shippingTotal - shippingDiscount).toFixed(2);

  const total = subtotal + discountedShipping;

  if (cart.length === 0) {
    return (
      <div className={`cart-page ${darkMode ? 'dark' : 'light'}`}>
        <h2>🛒 Your cart is empty.</h2>
        <Link to="/" style={{ color: '#00aaff', textDecoration: 'underline' }}>Shop now</Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`cart-page ${darkMode ? 'dark' : 'light'}`}>
      <h1>🛍️ Your Cart</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Weight (g)</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => {
            const weight = item.qty * (item.weightPerUnit || 0);
            const totalPrice = item.price * item.qty;

            return (
              <tr key={item._id}>
                <td><img src={item.image} alt={item.name} /></td>
                <td>{item.name}</td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    min="1"
                    max={item.stock}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value);
                      const newWeight = qty * (item.weightPerUnit || 0);
                      if (newWeight > 1500) {
                        alert("❌ Max allowed per item is 1.5kg");
                        return;
                      }
                      updateQty(item._id, qty);
                    }}
                  />
                </td>
                <td>₹{item.price}</td>
                <td>{weight}g</td>
                <td>₹{totalPrice.toFixed(2)}</td>
                <td>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>❌ Remove</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="cart-summary">
        <p><strong>Total Weight:</strong> {totalWeight}g</p>
        <p><strong>Shipping Charges:</strong> ₹{discountedShipping}
          {maxShippingDiscountPercent > 0 && (
            <span style={{ color: 'green', fontWeight: 'bold' }}> ({maxShippingDiscountPercent}% OFF)</span>
          )}
        </p>
        <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
        <h2>Total Amount: ₹{total.toFixed(2)}</h2>
      </div>

      <button className="checkout-btn" onClick={() => navigate('/checkout')}>
        🚀 Proceed to Checkout
      </button>

      <div style={{ marginTop: '5rem' }}>
        <Footer />
      </div>
    </div>
  );
}
