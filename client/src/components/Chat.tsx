import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { useSession } from "../lib/auth-client";

type ChatFormInputs = { message: string };
type ChatProps = {
  username: string;
};

export const Chat = ({ username }: ChatProps) => {
  const { register, handleSubmit, reset } = useForm<ChatFormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [showExtendedMessage, setShowExtendedMessage] = useState(false);
  const [displayResponse, setDisplayResponse] = useState(false);
  const { refetch } = useSession();
  const responseRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isLoading) {
      timeout = setTimeout(() => {
        setShowExtendedMessage(true);
      }, 3000);
    } else {
      setShowExtendedMessage(false);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isLoading]);

  const llamaRequest = async (data: { message: string }) => {
    setIsLoading(true);

    // Clear the response area directly
    if (responseRef.current) {
      responseRef.current.textContent = "";
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_PROD_URL}/api/ask`, {
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
    <div className="max-w-full md:max-w-[60%]">
      <div>
        <div>
          <h1 className="heading mb-4">Hi {username}, how are you?</h1>
        </div>
        {displayResponse ? (
          <p
            ref={responseRef}
            id="response"
            className="mb-4 p-4 bg-chat-grey min-h-[100px] whitespace-pre-wrap rounded-xl"
          ></p>
        ) : (
          <></>
        )}
      </div>
      <form onSubmit={handleSubmit(llamaRequest)} className="flex flex-col">
        <input
          type="text"
          placeholder="Type your message"
          className="w-full px-3 py-2 border border-custom-grey rounded mb-4 bg-background-grey"
          {...register("message", { required: true })}
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-custom-orange px-4 py-2 rounded disabled:bg-chat-grey"
            disabled={isLoading}
          >
            {isLoading 
              ? (showExtendedMessage ? "Sending... this can take a while" : "Sending...") 
              : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};
