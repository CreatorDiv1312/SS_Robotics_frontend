// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import ProductDetail from './pages/ProductDetail';
// import ProtectedRoute from './components/ProtectedRoute';
// import Header from './components/Header';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import Land from './pages/Land';
// import AdminDashboard from './pages/AdminDashboard';
// // import { ThemeProvider } from './context/ThemeContext';


// function App() {
//   return (

//     <Router>
//       <Header />
//       <Routes>
//         <Route path="/" element={
//           <ProtectedRoute>
//             <Home />
//           </ProtectedRoute>
//         } />
//         <Route path='/land' element={<Land />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/product/:id" element={
//           <ProtectedRoute>
//             <ProductDetail />
//           </ProtectedRoute>
//         } />
//         <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
//         <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
//         <Route path="/admindashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Land from './pages/Land';
import AdminDashboard from './pages/AdminDashboard';
import { useTheme } from './context/ThemeContext'; //  Import Theme
import AdminOrders from './pages/AdminOrders';
import AdminBannerUploader from './pages/AdminBannerUploader';
import { BannerProvider } from './context/BannerContext';
import OrderTracking from './pages/OrderTraacking';
import AdminOrderPanel from './pages/AdmminOrderPanel';
import OrderTracker from './pages/Ordercustracker';
import MyOrders from './pages/customerorder';
import AdminPromoCodes from './components/AdminPromo';

function App() {
  const { darkMode } = useTheme(); //  Access darkMode

  const backgroundColor = darkMode ? '#0B0F1A' : '#FFFFFF';
  const textColor = darkMode ? '#00A9FF' : '#222';

  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
        minHeight: '100vh',
        transition: 'all 0.4s ease-in-out'
      }}
    >
      <BannerProvider>
        <Router>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/land" element={<Land />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/orders' element={
                <ProtectedRoute>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path='/admin/banners' element={
                <ProtectedRoute>
                  <AdminBannerUploader />
                </ProtectedRoute>
              }
            />

            <Route
              path='/ordertracking/:orderId' element={
                <OrderTracking />
              }>
            </Route>

            <Route
              path='/admin/orderupdate' element={
                <ProtectedRoute>
                  <AdminOrderPanel />
                </ProtectedRoute>
              }>
            </Route>
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/track/:orderId" element={<OrderTracker />} />

            <Route
              path='/admin/promo' element={
                <ProtectedRoute>
                  <AdminPromoCodes />
                </ProtectedRoute>
              }
            >
            </Route>
          </Routes>

        </Router>
      </BannerProvider>
    </div>
  );
}

export default App;
