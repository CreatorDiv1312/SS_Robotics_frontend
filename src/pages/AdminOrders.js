import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { darkMode } = useTheme();

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(res.data.filter(order => !order.delivered)); // Show only undelivered
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDelivered = async (id) => {
    try {
      await API.put(`/orders/${id}/deliver`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Refresh order list
      fetchOrders();
    } catch (err) {
      console.error('❌ Failed to mark as delivered', err);
      alert("❌ Failed to mark as delivered");
    }
  };

  return (
    <div className={`admin-orders-page ${darkMode ? 'dark' : 'light'}`}>
      <h2 style={{ textAlign: 'center', margin: '2rem 0' }}>📦 All Orders</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Txn ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Products</th>
            <th>Address</th>
            <th>Mark</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.customerName}</td>
              <td>{order.txnId}</td>
              <td>₹{order.amount}</td>
              <td>{order.delivered ? '✅ Delivered' : '🚚 Pending'}</td>
              <td>
                <ul>
                  {order.products.map(p => (
                    <li key={p.productId?._id || p.name}>
                      {p.name || p.productId?.name} × {p.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.postalCode}
              </td>
              <td>
                <button onClick={() => markDelivered(order._id)}>✅ Mark as Delivered</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '5rem' }}><Footer /></div>
    </div>
  );
}
