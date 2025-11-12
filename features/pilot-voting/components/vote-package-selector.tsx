'use client';

import Image from 'next/image';
import { X, Plus, Minus, ShoppingCart, Zap } from 'lucide-react';
import type { PilotArtist, VotePackage } from '../types/voting.types';

interface VotePackageSelectorProps {
  artist: PilotArtist;
  packages: VotePackage[];
  onSelect: (pkg: VotePackage, quantity: number) => void;
  onClose: () => void;
}

export function VotePackageSelector({ artist, packages, onSelect, onClose }: VotePackageSelectorProps) {
  const [selectedPackage, setSelectedPackage] = useState<VotePackage>(packages[0]);
  const [quantity, setQuantity] = useState(1);

  const totalVotes = selectedPackage.votes * quantity;
  const totalPrice = selectedPackage.price * quantity;

  const handleAddToCart = () => {
    onSelect(selectedPackage, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header with Artist Info */}
        <div className="relative h-48 overflow-hidden">
          {artist.coverImage || artist.image ? (
            <Image
              src={artist.coverImage || artist.image}
              alt={artist.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-lime-400/20 to-purple-600/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
          
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white mb-1">
              Vote for {artist.stageName}
            </h2>
            <p className="text-white/70">Choose your vote package</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Package Selection */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Select Package</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    selectedPackage.id === pkg.id
                      ? 'border-lime-400 bg-lime-400/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-lime-400 rounded-full">
                        <Zap className="w-3 h-3 text-black" />
                        <span className="text-xs font-bold text-black">POPULAR</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white mb-1">{pkg.votes}</p>
                    <p className="text-white/60 text-xs mb-2">votes</p>
                    <p className="text-lime-400 font-bold">₦{pkg.price.toLocaleString()}</p>
                    {pkg.discount && (
                      <p className="text-lime-400 text-xs mt-1">-{pkg.discount}%</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex-1 text-center">
                <p className="text-4xl font-bold text-white">{quantity}</p>
                <p className="text-white/60 text-sm">
                  {quantity === 1 ? 'package' : 'packages'}
                </p>
              </div>
              
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-white/70">
                <span>Package:</span>
                <span className="font-semibold text-white">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Quantity:</span>
                <span className="font-semibold text-white">{quantity}x</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Votes per package:</span>
                <span className="font-semibold text-white">{selectedPackage.votes}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="text-white font-bold">Total Votes:</span>
                <span className="text-lime-400 font-bold">{totalVotes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-white font-bold">Total Price:</span>
                <span className="text-lime-400 font-bold">₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>

          {/* Info */}
          <p className="text-white/60 text-sm text-center">
            Your votes will be counted immediately after payment is confirmed
          </p>
        </div>
      </div>
    </div>
  );
}