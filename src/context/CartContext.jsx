import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotals, setCartTotals] = useState({ totalQuantity: 0, totalAmount: 0, totalItems: 0 });

  // Update totals whenever cartItems changes
  useEffect(() => {
    let totalQ = 0;
    let totalA = 0;
    
    cartItems.forEach(item => {
      totalQ += item.quantity;
      // Remove commas and currency symbols if present to calculate amount
      const priceValue = typeof item.price === 'string' 
        ? parseInt(item.price.replace(/[^\d]/g, ''), 10) 
        : item.price;
      totalA += priceValue * item.quantity;
    });

    setCartTotals({
      totalQuantity: totalQ,
      totalAmount: totalA,
      totalItems: cartItems.length
    });
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const decrementQuantity = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // If quantity is 1, decrementing removes it completely
        return prevItems.filter(item => item.id !== productId);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotals,
        addToCart,
        removeFromCart,
        updateQuantity,
        decrementQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
