'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const CartContext = createContext();

// 2. Provider component
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      const storedCart = localStorage.getItem('cart');
      
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          
          // Ensure all items have cartId for compatibility
          const cartWithIds = parsedCart.map((item, index) => ({
            ...item,
            cartId: item.cartId || `${Date.now()}-${index}-${Math.random()}`
          }));
          
          setCart(cartWithIds);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          localStorage.removeItem('cart');
          setCart([]);
        }
      } else {
        setCart([]);
      }
    };

    // Load cart initially
    loadCartFromStorage();
    setIsInitialized(true);

    // Listen for localStorage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCartFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save cart to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (!isInitialized) return; // Don't save until we've loaded from localStorage
    
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart, isInitialized]);

  // Add item to cart
  const addToCart = (newItem) => {
    const itemWithId = {
      ...newItem,
      cartId: `${Date.now()}-${Math.random()}`, // Unique identifier for each cart item
    };
    setCart((prevCart) => [...prevCart, itemWithId]);
  };

  // Remove item by index or cartId
  const removeFromCart = (indexOrId) => {
    setCart((prevCart) => {
      if (typeof indexOrId === 'number') {
        // Remove by index
        return prevCart.filter((_, idx) => idx !== indexOrId);
      } else {
        // Remove by cartId
        return prevCart.filter(item => item.cartId !== indexOrId);
      }
    });
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Calculate total price
  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  // Cart count
  const getCartCount = () => cart.length; // Count number of items, not sum of quantities

  // 3. Provide context value
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 4. Custom hook for easy access
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 