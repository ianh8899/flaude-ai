import { loadStripe } from "@stripe/stripe-js";
import { signOut } from "../lib/auth-client";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

async function handleCheckout() {
  const response = await fetch(
    `${import.meta.env.VITE_PROD_URL}/api/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  const stripeSession = await response.json();
  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId: stripeSession.id });
}

// Define a custom type for the user with tokens
interface UserWithTokens {
  id: string;
  name: string;
  email: string;
  tokens?: number;
  [key: string]: unknown;
}

interface SessionData {
  user: UserWithTokens;
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

interface NavProps {
  session: SessionData | null;
}

export const Nav = ({ session }: NavProps) => {
  if (!session) {
    return <></>;
  }

  return (
    <div className="flex flex-row justify-center gap-12 items-center pt-6 px-2">
      <p className="border border-custom-grey border-solid px-4 py-2 rounded text-center">
        Tokens available: {session.user?.tokens || 0}
      </p>
      <button
        className="bg-custom-orange hover:bg-orange-700 text-white px-4 py-2 rounded"
        onClick={handleCheckout}
      >
        Buy More Tokens
      </button>
      <button
        className="border border-custom-grey px-4 py-2 rounded hover:bg-black"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
};
