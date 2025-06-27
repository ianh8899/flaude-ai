import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { useSession } from "../lib/auth-client";

type ChatFormInputs = { message: string };

export const Chat = () => {
  const { register, handleSubmit, reset } = useForm<ChatFormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [displayResponse, setDisplayResponse] = useState(false);
  const { refetch } = useSession();
  const responseRef = useRef<HTMLParagraphElement>(null);

  const llamaRequest = async (data: { message: string }) => {
    setIsLoading(true);

    // Clear the response area directly
    if (responseRef.current) {
      responseRef.current.textContent = "";
    }

    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question: data.message,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setDisplayResponse(true);
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            // Directly append to DOM - bypasses React batching
            if (responseRef.current) {
              responseRef.current.textContent += chunk;
            }
          }
        }
      }
      await refetch();
    } catch (error) {
      console.error("Error during streaming:", error);
      if (responseRef.current) {
        responseRef.current.textContent =
          "Error: Failed to get response from the server.";
      }
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <>
      <div>
        {displayResponse ? (
          <p
            ref={responseRef}
            id="response"
            className="mb-4 p-4 border rounded bg-gray-50 min-h-[100px] whitespace-pre-wrap"
          ></p>
        ) : (
          <></>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Chat with Crab-GPT</h2>
        <p className="mb-4">
          Don't worry this crab has really poor memory and often forgets it's a
          crab. Type your message below:
        </p>
      </div>
      <form onSubmit={handleSubmit(llamaRequest)}>
        <input
          type="text"
          placeholder="Type your message"
          className="w-full px-3 py-2 border rounded mb-4"
          {...register("message", { required: true })}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </>
  );
};
