import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { auth } from "./auth";
import "dotenv/config";
import Stripe from "stripe";
import { HTTPException } from "hono/http-exception";
import ollama from "ollama";
import { addTokensToUser, reduceUserTokens } from "./utils/tokenUpdates";

type Session = {
  session: any;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const app = new Hono<{ Variables: Session }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Mount better-auth
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Authentication middleware
const requireAuth = async (c: any, next: any) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.header(),
    });

    if (!session) {
      throw new HTTPException(401, {
        message: "Unauthorized - Please log in",
      });
    }

    // Attach session to context
    c.set("session", session);
    await next();
  } catch (error) {
    throw new HTTPException(401, {
      message: "Invalid session",
    });
  }
};

app.post("/checkout", requireAuth, async (c) => {
  try {
    const session = c.get("session");
    console.log("User ID:", session.user.id);
    console.log("User Email:", session.user.email);

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1P3fKeCpgFfIjpkZIzNPwJWL",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
        quantity: 1,
      },
    });
    return c.json(stripeSession);
  } catch (error) {
    throw new HTTPException(500, {
      message: "Failed to create checkout session",
    });
  }
});

app.post("/webhook", async (c) => {
  try {
    const rawBody = await c.req.text();
    const sig = c.req.header("stripe-signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Error constructing webhook event:", err);
      throw new HTTPException(400, {
        message: "Webhook Error: Invalid signature",
      });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Checkout session completed:", session);
      if (session?.metadata) {
        addTokensToUser(
          session.metadata.userId,
          parseInt(session.metadata.quantity)
        );
      } else {
        console.warn("Session metadata is missing required fields.");
      }
    } else {
      console.warn("Unhandled event type:", event.type);
    }
    return c.text("Webhook received");
  } catch (error) {
    console.error("Webhook error:", error);
    return c.text("Webhook error", 500);
  }
});

app.post("/ask", requireAuth, async (c) => {
  const query = await c.req.json();
  const session = c.get("session");

  try {
    const response = await ollama.chat({
      model: "crab-llama",
      messages: [
        {
          role: "user",
          content: query.question,
        },
      ],
      stream: true,
    });

    // Set headers for Server-Sent Events
    c.header("Content-Type", "text/plain; charset=utf-8");
    c.header("Cache-Control", "no-cache");
    c.header("Connection", "keep-alive");

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of response) {
            const chunk = part.message.content;
            if (chunk) {
              controller.enqueue(new TextEncoder().encode(chunk));
            }
          }

          try {
            reduceUserTokens(session.user.id);
          } catch (tokenError) {
            console.error("Failed to reduce user tokens:", tokenError);
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked", // Force chunked encoding
      },
    });
  } catch (error) {
    console.error("Error in /ask endpoint:", error);
    throw new HTTPException(500, {
      message: "Internal Server Error",
    });
  }
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
