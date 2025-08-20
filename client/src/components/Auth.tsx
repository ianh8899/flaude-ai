import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, signUp } from "../lib/auth-client";
import { RxEnter } from "react-icons/rx";
import { FaCircleArrowUp, FaGithub } from "react-icons/fa6";

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
      <h1 className="heading mb-2">Your ideas, ruined.</h1>
      <p>A terrible Ai that rarely helps you create anything useful</p>
      {showSignIn ? (
        <div className="border border-custom-grey p-6 rounded-2xl max-w[80%] max-w-md mt-8">
          {/* <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2> */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmitSignIn)}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border rounded text-black"
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
                className="w-full px-3 py-2 border rounded text-black"
                {...register("password", { required: true })}
              />
            </div>
            <button
              type="submit"
              className="bg-custom-orange hover:bg-orange-700 px-4 py-2 rounded w-full"
            >
              Sign In <RxEnter className="inline-block ml-2" />
            </button>
          </form>
          <button
            className="mt-4 bg-black hover:bg-slate-900 px-4 py-2 rounded w-full"
            onClick={() => {
              signIn.social({
                provider: "github",
                callbackURL: `${import.meta.env.VITE_PROD_URL}`,
              });
            }}
          >
            <FaGithub className="inline-block mr-2" />
            Sign In with GitHub
          </button>
        </div>
      ) : (
        <div className="border border-custom-grey p-6 rounded-2xl max-w[80%] max-w-md mt-8">
          {/* <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2> */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmitSignUp)}>
            <div>
              <label
                className="block text-sm font-medium mb-1 "
                htmlFor="signup-email"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                className="w-full px-3 py-2 border rounded text-black"
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
                className="w-full px-3 py-2 border rounded text-black"
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
                className="w-full px-3 py-2 border rounded text-black"
                {...register("password", { required: true })}
              />
            </div>
            <button
              type="submit"
              className="bg-custom-orange hover:bg-orange-700 px-4 py-2 rounded w-full"
            >
              Sign Up <FaCircleArrowUp className="inline-block ml-2" />
            </button>
          </form>
          <button
            className="mt-4 bg-black hover:bg-slate-900 px-4 py-2 rounded w-full"
            onClick={() => {
              signIn.social({
                provider: "github",
                callbackURL: `${import.meta.env.VITE_PROD_URL}`,
              });
            }}
          >
            <FaGithub className="inline-block mr-2" /> Sign Up with GitHub
          </button>
        </div>
      )}
      <button
        className="mt-4 text-custom-orange underline"
        onClick={() => setShowSignIn(!showSignIn)}
      >
        {showSignIn
          ? "Don't have an account? Sign Up"
          : "Already have an account? Sign In"}
      </button>
    </div>
  );
};
