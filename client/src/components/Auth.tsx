import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, signUp } from "../lib/auth-client";

export const Auth = () => {
  type SignInForm = { email: string; password: string };
  type SignUpForm = { email: string; name: string; password: string };

  const [showSignIn, setShowSignIn] = useState(true);
  const { register, handleSubmit, reset } = useForm<
    SignInForm & Partial<SignUpForm>
  >();

  const onSubmitSignIn = (data: SignInForm) => {
    signIn.email(data);
    reset();
  };

  const onSubmitSignUp = (data: SignInForm & Partial<SignUpForm>) => {
    signUp.email(data as SignUpForm);
    reset();
  };

  return (
    <div className="p-6 flex flex-col items-center">
      {showSignIn ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmitSignIn)}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border rounded"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border rounded"
                {...register("password", { required: true })}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Sign In
            </button>
          </form>
          <button
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded w-full"
            onClick={() => {
              signIn.social({
                provider: "github",
                callbackURL: `${import.meta.env.VITE_FRONTEND_URL}`,
              });
            }}
          >
            Sign In with GitHub
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmitSignUp)}>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="signup-email"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                className="w-full px-3 py-2 border rounded"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-3 py-2 border rounded"
                {...register("name", { required: true })}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="signup-password"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                className="w-full px-3 py-2 border rounded"
                {...register("password", { required: true })}
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Sign Up
            </button>
          </form>
          <button
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded w-full"
            onClick={() => {
              signIn.social({
                provider: "github",
                callbackURL: `${import.meta.env.VITE_FRONTEND_URL}`,
              });
            }}
          >
            Sign Up with GitHub
          </button>
        </div>
      )}
      <button
        className="mt-4 text-blue-500 underline"
        onClick={() => setShowSignIn(!showSignIn)}
      >
        {showSignIn
          ? "Don't have an account? Sign Up"
          : "Already have an account? Sign In"}
      </button>
    </div>
  );
};
