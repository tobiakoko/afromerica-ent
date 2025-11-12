'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { CartModal } from './cart-modal';

export function FloatingCart() {
  const { cart, getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = getItemCount();

  if (itemCount === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-lime-400 hover:bg-lime-300 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 group"
        aria-label="View Cart"
      >
        <ShoppingCart className="w-7 h-7 text-black" />
        
        {/* Badge */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">{itemCount}</span>
        </div>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-lime-400 animate-ping opacity-20" />
      </button>

      {/* Cart Summary Tooltip (on hover) */}
      <div className="fixed bottom-28 right-8 z-40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-black border border-white/20 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-1">
            {cart.totalVotes.toLocaleString()} Votes
          </p>
          <p className="text-lime-400 font-bold">
            ₦{cart.totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}