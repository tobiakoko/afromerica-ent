"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from "lucide-react";
import { useCart } from "@/features/pilot-voting/context/cart-context";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    if (cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setProcessing(true);

    // TODO: Integrate with Paystack or payment provider
    // For now, just show a message
    setTimeout(() => {
      alert(`Checkout functionality coming soon! You would be charged $${cart.totalPrice.toFixed(2)} for ${cart.totalVotes} votes.`);
      setProcessing(false);
    }, 1000);
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-muted-foreground">
            Start voting for your favorite artists to add items to your cart
          </p>
          <Link href="/pilot-voting">
            <Button size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Voting
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Link href="/pilot-voting">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Voting
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cart Items ({cart.items.length})</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-destructive"
                >
                  Clear All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src={item.artistImage}
                        alt={item.artistName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.artistName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.packageName} - {item.votes} votes each
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-20"
                      />
                    </div>

                    <div className="text-right min-w-[100px]">
                      <div className="font-semibold">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.totalVotes} votes
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Votes</span>
                    <span className="font-semibold">{cart.totalVotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-semibold">{cart.items.length}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    Your votes will be applied immediately after successful payment
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={processing || !email}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {processing ? "Processing..." : "Proceed to Payment"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
