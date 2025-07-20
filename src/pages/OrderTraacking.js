import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import API from '../api/axios';
import '../style/OrderTracking.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faBox,
  faTruck,
  faMapMarkedAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const socket = io('http://localhost:5000');

const statusIcons = {
  Placed: faBoxOpen,
  Packed: faBox,
  Shipped: faTruck,
  'Out for Delivery': faMapMarkedAlt,
  Delivered: faCheckCircle,
};

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${orderId}`);
        setOrder(res.data);
        setError('');
      } catch (err) {
        setError('❌ Failed to load order. Please check the ID or try again later.');
        console.error(err);
      }
    };

    fetchOrder();

    socket.emit('track-order', orderId);

    socket.on('status-update', (update) => {
      setOrder(prev => ({
        ...prev,
        status: update.status,
        statusTimestamps: {
          ...prev?.statusTimestamps,
          [update.status]: update.time
        }
      }));
    });

    return () => {
      socket.off('status-update');
    };
  }, [orderId]);

  const stages = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  if (error) return <div className="order-error">{error}</div>;
  if (!order) return <div className="order-loading">Loading order details...</div>;

  return (
    <div className="tracking-wrapper">
      <div className="tracking-card">
        <h2 className="order-title">📦 Order Tracking</h2>
        <p className="order-id">Order ID: {orderId}</p>

        <ul className="timeline">
          {stages.map((stage, index) => {
            const isActive = stages.indexOf(order.status) >= index;
            return (
              <li key={stage} className={`timeline-step ${isActive ? 'active' : ''}`}>
                <div className="timeline-icon">
                  <FontAwesomeIcon icon={statusIcons[stage]} />
                </div>
                <div className="timeline-content">
                  <span className="timeline-stage">{stage}</span>
                  {order?.statusTimestamps?.[stage] && (
                    <span className="timeline-time">
                      {new Date(order.statusTimestamps[stage]).toLocaleString()}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
