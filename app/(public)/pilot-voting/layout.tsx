import { CartProvider } from "@/features/pilot-voting/context/cart-context";

export default function PilotVotingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
