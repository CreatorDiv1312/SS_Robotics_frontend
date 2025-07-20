// 

//Above code contains code without disocunt 

// ================================Below code contains with discount==================

import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminGate from '../components/AdminGate';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import '../style/AdminDashboard.css';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    stock: '',
    weightPerUnit: '',
    category: 'readymade',
    discount: '' // ✅ Add discount field
  });
  const [editId, setEditId] = useState(null);
  const [editProduct, setEditProduct] = useState({});
  const { user } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(localStorage.getItem('adminAccess') === 'true');

  const categories = ['readymade', 'projectscale', 'model', 'sensors', 'developmentboard', 'gearmotor', 'driver'];

  const categoryLabels = {
    readymade: 'Readymade',
    projectscale: 'Project Scale',
    model: 'Model',
    sensors: 'Sensors',
    developmentboard: 'Development Board',
    gearmotor: 'Gear Motor',
    driver: 'Driver'
  };

  useEffect(() => {
    if (accessGranted) fetchProducts();
  }, [accessGranted]);

  const fetchProducts = async () => {
    const res = await API.get('/products');
    setProducts(res.data);
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        weightPerUnit: parseFloat(newProduct.weightPerUnit),
        discount: parseFloat(newProduct.discount || 0)
      };

      await API.post('/products', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setNewProduct({
        name: '',
        price: '',
        image: '',
        description: '',
        stock: '',
        weightPerUnit: '',
        category: 'readymade',
        discount: ''
      });

      fetchProducts();
      alert("✅ Product created successfully");
    } catch (err) {
      console.error("Product creation failed:", err.response?.data || err.message);
      alert("❌ Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProducts();
      alert("🗑️ Product deleted");
    } catch (err) {
      alert("❌ Failed to delete");
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditProduct({
      name: product.name || '',
      price: product.price || '',
      stock: product.stock || '',
      image: product.image || '',
      description: product.description || '',
      weightPerUnit: product.weightPerUnit || '',
      category: product.category || 'readymade',
      discount: product.discount || ''
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedPayload = {
        ...editProduct,
        price: parseFloat(editProduct.price),
        stock: parseInt(editProduct.stock),
        weightPerUnit: parseFloat(editProduct.weightPerUnit),
        discount: parseFloat(editProduct.discount || 0)
      };

      await API.put(`/products/${editId}`, updatedPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setEditId(null);
      fetchProducts();
      alert("✅ Product updated");
    } catch (err) {
      alert("❌ Failed to update product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!accessGranted) {
    return <AdminGate onAccessGranted={() => setAccessGranted(true)} />;
  }

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark' : 'light'}`}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>🛠️ Admin Product Dashboard</h2>

      <div className="section">
        <h3>➕ Add Product</h3>
        {['name', 'price', 'image', 'description', 'stock', 'weightPerUnit', 'discount'].map(field => (
          <input
            key={field}
            placeholder={field}
            value={newProduct[field]}
            onChange={e => setNewProduct({ ...newProduct, [field]: e.target.value })}
          />
        ))}
        <select
          value={newProduct.category}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{categoryLabels[cat]}</option>
          ))}
        </select>
        <br />
        <button onClick={handleCreate}>Create Product</button>
      </div>

      <div className="section">
        <h3>📦 Product List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Discount</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>
                  {editId === p._id
                    ? <input value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} />
                    : p.name}
                </td>
                <td>
                  {editId === p._id
                    ? <input value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} />
                    : `₹${p.price}`}
                </td>
                <td>
                  {editId === p._id
                    ? <input value={editProduct.stock} onChange={e => setEditProduct({ ...editProduct, stock: e.target.value })} />
                    : p.stock}
                </td>
                <td>
                  {editId === p._id
                    ? (
                      <select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}>
                        {categories.map(cat => <option key={cat} value={cat}>{categoryLabels[cat]}</option>)}
                      </select>
                    )
                    : categoryLabels[p.category] || p.category}
                </td>
                <td>
                  {editId === p._id
                    ? <input value={editProduct.discount} onChange={e => setEditProduct({ ...editProduct, discount: e.target.value })} />
                    : `${p.discount || 0}%`}
                </td>
                <td>
                  {editId === p._id
                    ? <input value={editProduct.image} onChange={e => setEditProduct({ ...editProduct, image: e.target.value })} />
                    : <img src={p.image} alt={p.name} />}
                </td>
                <td>
                  {editId === p._id ? (
                    <>
                      <button onClick={handleUpdate}>💾 Save</button>
                      <button onClick={() => setEditId(null)}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(p)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(p._id)}>🗑️ Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '5rem' }}>
        <Footer />
      </div>
    </div>
  );
}
