import { useSession } from "./lib/auth-client";
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
    <div>
      <Nav session={session} />
      <div className="p-12 flex flex-col items-center align-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Welcome to Crab-GPT</h1>
        {session ? (
          <div>
            <p className="mb-4">Welcome, {session.user?.name || "Username"}!</p>
            <Chat />
          </div>
        ) : (
          <Auth />
        )}
      </div>
    </div>
  );
}

export default App;
