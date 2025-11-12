"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import type { PaymentVerifyResponse } from "@/lib/payments/types";

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference");
  const type = searchParams.get("type") as "voting" | "booking" | null;

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [paymentData, setPaymentData] = useState<PaymentVerifyResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setError("Payment reference not found");
      return;
    }

    verifyPayment();
  }, [reference]);

  const verifyPayment = async () => {
    try {
      setStatus("loading");

      const response = await fetch(`/api/payments/verify?reference=${reference}`);
      const result: PaymentVerifyResponse = await response.json();

      setPaymentData(result);

      if (result.success && result.data?.status === "completed") {
        setStatus("success");
      } else {
        setStatus("failed");
        setError(result.message || "Payment verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("failed");
      setError("An error occurred while verifying your payment");
    }
  };

  const getRedirectUrl = () => {
    if (type === "voting") {
      return "/pilot-voting";
    } else if (type === "booking") {
      return "/events";
    }
    return "/";
  };

  const getContinueLabel = () => {
    if (type === "voting") {
      return "Back to Voting";
    } else if (type === "booking") {
      return "View Events";
    }
    return "Go Home";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Payment Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === "loading" && (
              <div className="text-center space-y-4 py-8">
                <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin" />
                <h2 className="text-xl font-semibold">Verifying your payment...</h2>
                <p className="text-muted-foreground">
                  Please wait while we confirm your transaction
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center space-y-4 py-8">
                <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                <p className="text-muted-foreground">
                  Your payment has been confirmed and processed successfully.
                </p>

                {paymentData?.data && (
                  <div className="space-y-2 p-4 bg-accent rounded-lg text-left">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reference</span>
                      <span className="text-sm font-medium">
                        {paymentData.data.reference}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="text-sm font-medium">
                        ${paymentData.data.amount.toFixed(2)}
                      </span>
                    </div>
                    {paymentData.data.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Paid At</span>
                        <span className="text-sm font-medium">
                          {new Date(paymentData.data.paidAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {type === "voting" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      Your votes have been applied to your selected artists!
                    </p>
                  </div>
                )}

                {type === "booking" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      Your booking has been confirmed! A confirmation email has been sent
                      to your email address.
                    </p>
                  </div>
                )}

                <Link href={getRedirectUrl()}>
                  <Button size="lg" className="gap-2">
                    {getContinueLabel()}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {status === "failed" && (
              <div className="text-center space-y-4 py-8">
                <XCircle className="h-16 w-16 mx-auto text-destructive" />
                <h2 className="text-2xl font-bold text-destructive">Payment Failed</h2>
                <p className="text-muted-foreground">
                  {error || "We couldn't verify your payment. Please try again."}
                </p>

                {reference && (
                  <div className="p-4 bg-accent rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Reference: <span className="font-medium">{reference}</span>
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={verifyPayment}>
                    Try Again
                  </Button>
                  <Link href={getRedirectUrl()}>
                    <Button variant="outline">{getContinueLabel()}</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}