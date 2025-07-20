import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import API from '../api/axios';
import '../style/OrderCustomerTracking.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faBox,
  faTruck,
  faMapMarkedAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const socket = io('https://4b0926e9-9bf9-4356-8fda-d07538876873-00-3d2g23pbmlfua.sisko.replit.dev/');

const statusIcons = {
  Placed: faBoxOpen,
  Packed: faBox,
  Shipped: faTruck,
  'Out for Delivery': faMapMarkedAlt,
  Delivered: faCheckCircle,
};

export default function OrderTracker() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      }
    };

    fetchOrder();
    socket.emit('track-order', orderId);

    socket.on('status-update', (update) => {
      setOrder(prev => ({
        ...prev,
        status: update.status,
        statusTimestamps: {
          ...prev.statusTimestamps,
          [update.status]: update.time
        }
      }));
    });

    return () => {
      socket.off('status-update');
    };
  }, [orderId]);

  const stages = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  return (
    <div className="cust-tracking-wrapper">
      <div className="cust-tracking-card">
        <h2 className="cust-heading">📦 Your Order Journey</h2>
        <p className="cust-subtext">Tracking ID: {orderId}</p>

        {!order ? (
          <p className="cust-loading">Loading your order details...</p>
        ) : (
          <ul className="cust-timeline">
            {stages.map((stage, index) => {
              const isActive = stages.indexOf(order.status) >= index;
              return (
                <li key={stage} className={`cust-step ${isActive ? 'active' : ''}`}>
                  <div className="cust-icon">
                    <FontAwesomeIcon icon={statusIcons[stage]} />
                  </div>
                  <div className="cust-info">
                    <span className="cust-stage">{stage}</span>
                    {order.statusTimestamps?.[stage] && (
                      <span className="cust-time">
                        {new Date(order.statusTimestamps[stage]).toLocaleString()}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
