// import { createContext, useContext, useState } from 'react';

// export const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   const addToCart = (product, qty = 1) => {
//     setCart(prev => {
//       const existing = prev.find(p => p._id === product._id);
//       const weightPerUnit = product.weightPerUnit || 0;
//       const totalWeight = qty * weightPerUnit;

//       if (existing) {
//         // this line was causing issues 
//         // return prev.map(p => p._id === product._id ? { ...p, qty: p.qty + qty, totalWeight: (p.qty+ qty)* weightPerUnit } : p);

//         const updateQty = existing.qty + qty;
//         const updatedWeight = updateQty * weightPerUnit;
//         return prev.map(p =>
//           p._id === product._id ? { ...p, qty: updateQty, totalWeight: updatedWeight } : p
//         );
//       }
//       return [...prev, { ...product, qty, totalWeight }];
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart(prev => prev.filter(p => p._id !== id));
//   };

//   const updateQty = (id, qty) => {
//     setCart(prev =>
//       prev.map(p => p._id === id ? { ...p, qty } : p)
//     );
//   };

//   const clearCart = () => setCart([]);

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };


// Code updated with weight based costing logic
import { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p._id === product._id);
      const weightPerUnit = product.weightPerUnit || 0;

      if (existing) {
        const newQty = existing.qty + qty;
        return prev.map(p =>
          p._id === product._id ? { ...p, qty: newQty } : p
        );
      }

      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p._id !== id));
  };

  const updateQty = (id, qty) => {
    setCart(prev =>
      prev.map(p => p._id === id ? { ...p, qty } : p)
    );
  };

  const updateWeight = (id, customWeight) => {
    setCart(prev =>
      prev.map(p => p._id === id ? { ...p, customWeight } : p)
    );
  };

  const clearCart = () => setCart([]);

  const updateCartItemWeight = (id, weight) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id ? { ...item, customWeight: weight } : item
      )
    );
  };


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, updateWeight, clearCart, updateCartItemWeight }}>
      {children}
    </CartContext.Provider>
  );
};
