import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

async function handleCheckout() {
  const response = await fetch("http://localhost:3000/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const stripeSession = await response.json();
  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId: stripeSession.id });
}

export const Nav = () => {
  return (
    <>
      <button onClick={handleCheckout}>Checkout</button>
    </>
  );
};
