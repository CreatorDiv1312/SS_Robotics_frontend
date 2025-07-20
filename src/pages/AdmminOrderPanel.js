import { useEffect, useState } from 'react';
import API from '../api/axios';
import '../style/AdminOrderPanel.css';

export default function AdminOrderPanel() {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch orders:', err);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      await API.patch(`/orders/${orderId}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // ✅ Optimistically update frontend
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('❌ Failed to update status:', err);
      alert('Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-order-panel">
      <h2>📦 Admin Order Control Panel</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : null}
      {orders.map(order => (
        <div key={order._id} className="order-item">
          <h4>Order ID: {order._id}</h4>
          <p>Customer: {order.customerName}</p>
          <p>Status: {order.status || 'Placed'}</p>
          <select
            disabled={updating}
            onChange={(e) => updateStatus(order._id, e.target.value)}
            value={order.status || 'Placed'}
          >
            <option>Placed</option>
            <option>Packed</option>
            <option>Shipped</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
          </select>
          
        </div>
      ))}
    </div>
  );
}
