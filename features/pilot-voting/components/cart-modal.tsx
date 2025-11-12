'use client';

import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { initializePayment } from '../api/pilot-voting.api';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await initializePayment({
        email,
        items: cart.items,
        totalAmount: cart.totalPrice,
      });

      if (response.success && response.paymentUrl) {
        // Redirect to Paystack payment page
        window.location.href = response.paymentUrl;
      } else {
        setError(response.message || 'Failed to initialize payment');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-lime-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Your Cart</h2>
              <p className="text-white/60 text-sm">
                {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300"
              >
                Start Voting
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 flex gap-4"
              >
                {/* Artist Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  {item.artistImage ? (
                    <Image
                      src={item.artistImage}
                      alt={item.artistName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-lime-400/20 to-purple-600/20 flex items-center justify-center">
                      <span className="text-2xl">🎤</span>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1">
                  <h3 className="text-white font-bold">{item.artistName}</h3>
                  <p className="text-white/60 text-sm">{item.packageName}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-lime-400 font-bold">
                      {item.votes} votes
                    </span>
                    <span className="text-white/60">•</span>
                    <span className="text-white font-semibold">
                      ₦{item.pricePerPackage.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-white font-bold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-white/60 text-xs">Total</p>
                    <p className="text-white font-bold">
                      ₦{item.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Checkout */}
        {cart.items.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-white/70">
                <span>Total Votes:</span>
                <span className="font-semibold text-lime-400">
                  {cart.totalVotes.toLocaleString()} votes
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-white font-bold">Total Amount:</span>
                <span className="text-lime-400 font-bold">
                  ₦{cart.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-lime-400"
            />

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Payment
                </>
              )}
            </button>

            <p className="text-white/60 text-xs text-center">
              Secure payment powered by Paystack
            </p>
          </div>
        )}
      </div>
    </div>
  );
}