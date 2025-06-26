import { signOut, useSession } from "./lib/auth-client";
import { Auth } from "./components/Auth";
import { Nav } from "./components/Nav";
import { Chat } from "./components/Chat";

function App() {
  const { data: session, isPending } = useSession();
  console.log("Session Data:", session);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-12 flex flex-col items-center align-center justify-center min-h-screen">
      <Nav session={session} />
      <h1 className="text-2xl font-bold mb-6">My App</h1>
      {session ? (
        <div>
          <p className="mb-4">Welcome, {session.user?.name || "Username"}!</p>
          <Chat />
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
