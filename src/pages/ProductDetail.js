import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../style/ProductDetail.css';
import { useTheme } from '../context/ThemeContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Product fetch failed", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className='product-loading'>Loading...</p>;

  const weightPerUnit = product.weightPerUnit || 0;
  const totalWeight = qty * weightPerUnit;

  return (
    <div className={`product-detail-page ${darkMode ? 'dark' : 'light'}`}>
      <div className="product-container">
        {/* Left Section: Image */}
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Right Section: Info */}
        <div className="product-info">
          <h1>{product.name}</h1>

          {/* Show only original price */}
          <p className="product-price">₹{product.price}</p>

          <p className="product-description">{product.description}</p>

          {/* Optional: Show weight info if available */}
          {weightPerUnit > 0 && (
            <p className="product-weight">📦 {weightPerUnit}g per unit</p>
          )}

          {product.stock > 0 ? (
            <>
              <label className="product-qty">
                Qty:
                <input
                  type="number"
                  value={qty}
                  min="1"
                  max={product.stock}
                  onChange={e => setQty(parseInt(e.target.value) || 1)}
                />
              </label>

              <div className="product-buttons">
                <button
                  className="add-to-cart-btn"
                  onClick={() =>
                    addToCart(
                      product,
                      { ...product, totalWeight },
                      qty
                    )
                  }
                >
                  🛒 Add to Cart
                </button>
                <button className="buy-now-btn">
                  ⚡ Buy Now
                </button>
              </div>
            </>
          ) : (
            <p className="out-of-stock">❌ Out of Stock</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: '5rem' }}>
        <Footer />
      </div>
    </div>
  );
}
