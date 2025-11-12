import { JSX } from "react";

export default function PaymentCallbackPage(): JSX.Element {
    return (
        <main
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                padding: 16,
            }}
        >
            <div>
                <h1>Payment Callback</h1>
                <p>This is a placeholder page for handling payment gateway callbacks.</p>
            </div>
        </main>
    );
}