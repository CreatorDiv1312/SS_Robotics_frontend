// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import API from '../api/axios';
// import { useTheme } from '../context/ThemeContext';
// import { useBanner } from '../context/BannerContext';
// import '../style/Home.css';
// import Footer from '../components/Footer';

// export default function Home() {
//   const [products, setProducts] = useState([]);
//   const [banners, setBanners] = useState([]);
//   const { darkMode } = useTheme();
//   const { reloadBanner } = useBanner();

//   useEffect(() => {
//     const root = document.documentElement;
//     root.style.setProperty('--bg-color', darkMode ? '#0B0F1A' : '#FFFFFF');
//     root.style.setProperty('--card-bg', darkMode ? '#111926' : '#f9f9f9');
//     root.style.setProperty('--card-shadow', darkMode ? '0 0 8px rgba(0, 169, 255, 0.2)' : '0 2px 12px rgba(0,0,0,0.1)');
//     root.style.setProperty('--text-color', darkMode ? '#00A9FF' : '#222');
//     root.style.setProperty('--muted-text', darkMode ? '#aaa' : '#555');
//     root.style.setProperty('--offline-bg', darkMode ? '#111' : '#f2f2f2');
//   }, [darkMode]);

//   useEffect(() => {
//     const fetchContent = async () => {
//       try {
//         const [productRes, bannerRes] = await Promise.all([
//           API.get('/products'),
//           API.get('/banner')
//         ]);
//         setProducts(productRes.data);

//         const data = bannerRes.data;
//         if (Array.isArray(data.images)) {
//           setBanners(data.images);
//         } else if (data.image) {
//           setBanners([data.image]);
//         } else {
//           setBanners([]);
//         }
//       } catch (err) {
//         console.error("Error fetching homepage content", err);
//       }
//     };
//     fetchContent();
//   }, [reloadBanner]);

//   const groupedProducts = products.reduce((acc, product) => {
//     const category = product.category || 'Uncategorized';
//     if (!acc[category]) acc[category] = [];
//     acc[category].push(product);
//     return acc;
//   }, {});

//   return (
//     <div className="home-container">
//       {/* Banner Carousel */}
//       {banners.length > 0 && (
//         <div className="carousel-container">
//           <div className="carousel-track" style={{ width: `${banners.length * 100}%` }}>
//             {banners.map((image, index) => (
//               <img
//                 key={index}
//                 src={image}
//                 alt={`Banner ${index + 1}`}
//                 className="carousel-slide"
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Hero Section */}
//       <section className="hero-section">
//         <h1>Welcome to SS Robotics</h1>
//         <p>Where innovation meets precision. Discover our curated collection of cutting-edge automation products tailored for the future.</p>
//       </section>

//       {/* Category-wise Products */}
//       <section className="products-section">
//         <h2>Explore Our Products</h2>
//         {Object.entries(groupedProducts).map(([category, items]) => (
//           <div key={category} className="category-section">
//             <h3 className="category-heading">{category}</h3>
//             <div className="product-list">
//               {items.map(p => (
//                 <div key={p._id} className="product-card">
//                   <img src={p.image} alt={p.name} />
//                   <h3>{p.name}</h3>
//                   <p>₹{p.price}</p>
//                   <Link to={`/product/${p._id}`}>
//                     <button>View</button>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* Offline Section */}
//       <section className="offline-section">
//         <h2>Visit Our Offline Store</h2>
//         <p>Our flagship store offers live demos, real-time product testing, and one-on-one guidance from our experts.</p>
//         <strong>📍 SS Robotics, 42 Tech Street, Sector 9, Robotics City, India – 202599</strong>
//       </section>

//       <div style={{ marginTop: '5rem' }}>
//         <Footer />
//       </div>
//     </div>
//   );
// }


//Above code discarded due to complexity issues

// ========================================= Below code contains the better code =====================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { useBanner } from '../context/BannerContext';
import '../style/Home.css';
import Footer from '../components/Footer';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const { darkMode } = useTheme();
  const { reloadBanner } = useBanner();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', darkMode ? '#0B0F1A' : '#FFFFFF');
    root.style.setProperty('--card-bg', darkMode ? '#111926' : '#f9f9f9');
    root.style.setProperty('--card-shadow', darkMode ? '0 0 8px rgba(0, 169, 255, 0.2)' : '0 2px 12px rgba(0,0,0,0.1)');
    root.style.setProperty('--text-color', darkMode ? '#00A9FF' : '#222');
    root.style.setProperty('--muted-text', darkMode ? '#aaa' : '#555');
    root.style.setProperty('--offline-bg', darkMode ? '#111' : '#f2f2f2');
  }, [darkMode]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [productRes, bannerRes] = await Promise.all([
          API.get('/products'),
          API.get('/banner')
        ]);
        setProducts(productRes.data);

        const data = bannerRes.data;
        if (Array.isArray(data.images)) {
          setBanners(data.images);
        } else if (data.image) {
          setBanners([data.image]);
        } else {
          setBanners([]);
        }
      } catch (err) {
        console.error("Error fetching homepage content", err);
      }
    };
    fetchContent();
  }, [reloadBanner]);

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="home-container">
      {/* Banner Carousel */}
      {banners.length > 0 && (
        <div className="carousel-container">
          <div className="carousel-track" style={{ width: `${banners.length * 100}%` }}>
            {banners.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Banner ${index + 1}`}
                className="carousel-slide"
              />
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to SS Robotics</h1>
        <p>Where innovation meets precision. Discover our curated collection of cutting-edge automation products tailored for the future.</p>
      </section>

      {/* Category-wise Products */}
      <section className="products-section">
        <h2>Explore Our Products</h2>
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div key={category} className="category-section">
            <h3 className="category-heading">{category}</h3>
            <div className="product-list">
              {items.map(p => {
                const hasDiscount = parseFloat(p.discount) > 0 &&
                  (!p.discountExpiresAt || new Date(p.discountExpiresAt) > new Date());

                return (
                  <div key={p._id} className="product-card">
                    {hasDiscount && (
                      <span className="discount-badge">
                        {p.discount}% OFF
                      </span>
                    )}
                    <img src={p.image} alt={p.name} />
                    <h3>{p.name}</h3>
                    <p>₹{p.price}</p>
                    <Link to={`/product/${p._id}`}>
                      <button>View</button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Offline Section */}
      <section className="offline-section">
        <h2>Visit Our Offline Store</h2>
        <p>Our flagship store offers live demos, real-time product testing, and one-on-one guidance from our experts.</p>
        <strong>📍 SS Robotics, 42 Tech Street, Sector 9, Robotics City, India – 202599</strong>
      </section>

      <div style={{ marginTop: '5rem' }}>
        <Footer />
      </div>
    </div>
  );
}
