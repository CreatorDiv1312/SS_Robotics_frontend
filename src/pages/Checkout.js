import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import API from '../api/axios';
import '../style/checkout.css';
import { useTheme } from '../context/ThemeContext';
import scanner from '../assests/PaymentQR.jpg';

export default function Checkout() {
  const { cart, clearCart, updateCartItemWeight } = useCart();
  const { user } = useContext(AuthContext);
  const { darkMode } = useTheme();

  const [txnId, setTxnId] = useState('');
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoSuccess, setPromoSuccess] = useState('');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const navigate = useNavigate();
  const currentDate = new Date();

  const calculateShipping = (weight) => {
    if (weight <= 500) return 200;
    if (weight <= 1000) return 400;
    return 600;
  };

  const maxShippingDiscountPercent = Math.max(...cart.map(item => parseFloat(item.discount) || 0));
  const totalWeight = cart.reduce((sum, item) => {
    return sum + item.qty * (item.weightPerUnit || 0);
  }, 0);
  const rawShipping = calculateShipping(totalWeight);

  const effectiveShippingDiscount = promoDiscount > 0 ? promoDiscount : maxShippingDiscountPercent;
  const shippingDiscount = (rawShipping * effectiveShippingDiscount) / 100;
  const discountedShipping = +(rawShipping - shippingDiscount).toFixed(2);

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  const total = subtotal + discountedShipping;

  const applyPromo = async () => {
    try {
      const res = await API.post('/promo/validate', { code: promoCode });
      const discount = res.data.discountPercent;
      setPromoDiscount(discount);
      setPromoError('');
      setPromoSuccess(`🎉 Promo Applied! ${discount}% OFF on shipping.`);
    } catch (err) {
      setPromoDiscount(0);
      setPromoSuccess('');
      setPromoError('❌ Invalid or expired promo code');
    }
  };

  const handleOrderSubmit = async () => {
    try {
      setLoading(true);

      const orderPayload = {
        products: cart.map(item => {
          const discount = parseFloat(item.discount) || 0;
          const expiryDate = item.discountExpiry ? new Date(item.discountExpiry) : null;
          const isDiscountValid = discount > 0 && (!expiryDate || currentDate <= expiryDate);
          const weight = item.qty * (item.weightPerUnit || 0);
          const shipping = calculateShipping(weight);

          return {
            productId: item._id,
            name: item.name,
            quantity: item.qty,
            weight,
            price: item.price,
            originalPrice: item.price,
            discount: isDiscountValid ? discount : 0,
            shipping
          };
        }),
        txnId,
        amount: total,
        shipping: discountedShipping,
        promoCode,
        address
      };

      const res = await API.post('/orders', orderPayload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setInvoiceUrl(res.data.invoiceUrl);
      clearCart();
      alert("✅ Order placed successfully! Invoice sent to your email.");
      setTimeout(() => navigate('/'), 10000);
    } catch (err) {
      console.error("❌ Order failed", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`checkout-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="checkout-box">
        <h2>🧾 Secure Checkout</h2>

        {loading ? (
          <div className="loading-screen">
            <p>⏳ Processing your order... Please wait while we generate your invoice.</p>
            <div className='spinner'></div>
          </div>
        ) : (
          <>
            <p className="checkout-total">Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p className="checkout-total">
              Shipping: ₹{discountedShipping.toFixed(2)}
              {effectiveShippingDiscount > 0 && (
                <span style={{ color: 'green', fontWeight: 'bold' }}> ({effectiveShippingDiscount}% OFF)</span>
              )}
            </p>
            <p className="checkout-total">Total: ₹{total.toFixed(2)}</p>

            {/* Promo Code Section */}
            <div className="promo-section">
              <input
                type="text"
                placeholder="Enter Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={applyPromo}>🎟️ Apply Promo</button>
              {promoError && <p className="promo-error">{promoError}</p>}
              {promoSuccess && <p className="promo-success">{promoSuccess}</p>}
            </div>

            <div className="cart-items">
              <h3>🛒 Your Items</h3>
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <p>{item.name} (Qty: {item.qty})</p>
                  <input
                    type="number"
                    placeholder="Enter weight (g)"
                    value={item.customWeight || ''}
                    disabled
                  />
                </div>
              ))}
            </div>

            <div className="qr-section">
              <h4>📷 Scan & Pay</h4>
              <img src={scanner} alt="QR Code" />
            </div>

            <div className="txn-section">
              <label htmlFor="txnId">Transaction ID</label>
              <input
                type="text"
                id="txnId"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                required
                placeholder="Paste your UPI transaction ID here"
              />
            </div>

            <h3>🚚 Shipping Address</h3>
            <div className="address-form">
              {Object.keys(address).map(field => (
                <input
                  key={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={address[field]}
                  onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                  required
                />
              ))}
            </div>

            <button className="checkout-btn" onClick={handleOrderSubmit}>
              ✅ Confirm Payment & Place Order
            </button>

            {invoiceUrl && (
              <div className="invoice-section">
                <a
                  href={`http://localhost:5000${invoiceUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  📄 Download Invoice
                </a>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ marginTop: '5rem' }}>
        <Footer />
      </div>
    </div>
  );
}
