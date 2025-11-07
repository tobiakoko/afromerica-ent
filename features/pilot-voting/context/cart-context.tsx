"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { VotingCart, CartItem, CartAction } from "../types/voting.types";

// Cart reducer
function cartReducer(state: VotingCart, action: CartAction): VotingCart {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.artistId === action.payload.artistId &&
          item.packageId === action.payload.packageId
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update existing item
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + action.payload.quantity;
            return {
              ...item,
              quantity: newQuantity,
              totalVotes: item.votes * newQuantity,
              totalPrice: item.pricePerPackage * newQuantity,
            };
          }
          return item;
        });
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      const totalVotes = newItems.reduce((sum, item) => sum + item.totalVotes, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

      return {
        ...state,
        items: newItems,
        totalVotes,
        totalPrice,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const totalVotes = newItems.reduce((sum, item) => sum + item.totalVotes, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

      return {
        ...state,
        items: newItems,
        totalVotes,
        totalPrice,
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) => {
        if (item.id === action.payload.itemId) {
          const newQuantity = Math.max(1, action.payload.quantity);
          return {
            ...item,
            quantity: newQuantity,
            totalVotes: item.votes * newQuantity,
            totalPrice: item.pricePerPackage * newQuantity,
          };
        }
        return item;
      });

      const totalVotes = newItems.reduce((sum, item) => sum + item.totalVotes, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

      return {
        ...state,
        items: newItems,
        totalVotes,
        totalPrice,
      };
    }

    case "CLEAR_CART": {
      return {
        items: [],
        totalVotes: 0,
        totalPrice: 0,
        currency: state.currency,
      };
    }

    default:
      return state;
  }
}

// Context
interface CartContextType {
  cart: VotingCart;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    totalVotes: 0,
    totalPrice: 0,
    currency: "USD",
  });

  // Persist cart to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("voting-cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("voting-cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart) as VotingCart;
          if (parsed.items && parsed.items.length > 0) {
            parsed.items.forEach((item) => {
              dispatch({ type: "ADD_ITEM", payload: item });
            });
          }
        } catch (error) {
          console.error("Failed to load cart from localStorage:", error);
        }
      }
    }
  }, []);

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
