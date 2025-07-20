import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import '../style/AdminPromo.css'; // optional for styling

export default function AdminPromoCodes() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [error, setError] = useState('');

  const fetchPromoCodes = async () => {
    try {
      const res = await API.get('/promo');
      setPromoCodes(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch promo codes", err);
    }
  };

  const createPromo = async () => {
    if (!newCode || discountPercent < 1 || discountPercent > 100) {
      return setError("Enter a valid promo code and discount between 1–100%");
    }

    try {
      await API.post('/promo', {
        code: newCode.toUpperCase(),
        discountPercent: Number(discountPercent)
      });
      setNewCode('');
      setDiscountPercent(10);
      setError('');
      fetchPromoCodes();
    } catch (err) {
      console.error("❌ Failed to create promo code", err);
      setError(err.response?.data?.error || 'Failed to create promo code');
    }
  };

  const deletePromo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this promo code?")) return;
    try {
      await API.delete(`/promo/${id}`);
      fetchPromoCodes();
    } catch (err) {
      console.error("❌ Failed to delete promo", err);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return (
    <div className="admin-promo-container">
      <h2>🎁 Manage Promo Codes</h2>

      <div className="create-form">
        <input
          type="text"
          placeholder="Enter promo code (e.g. SAVE10)"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Discount %"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
        />
        <button onClick={createPromo}>➕ Create Promo</button>
        {error && <p className="error">{error}</p>}
      </div>

      <table className="promo-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount (%)</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {promoCodes.map(promo => (
            <tr key={promo._id}>
              <td>{promo.code}</td>
              <td>{promo.discountPercent}%</td>
              <td>{promo.active ? '✅ Active' : '❌ Inactive'}</td>
              <td>{new Date(promo.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="delete-btn" onClick={() => deletePromo(promo._id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
