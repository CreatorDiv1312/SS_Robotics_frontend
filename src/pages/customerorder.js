import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import '../style/MyOrders.css'; // Add this line for styles

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/orders/my', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch customer orders:', err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="my-orders">
      <h2>📦 My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <span className={`status-badge status-${order.status?.replace(/\s+/g, '-').toLowerCase()}`}>
                  {order.status || 'Placed'}
                </span>
              </div>
              <p><strong>Amount:</strong> ₹{order.amount}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <Link to={`/track/${order._id}`} className="track-link">🔍 Track Order</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
