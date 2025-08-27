import { useSession } from "./lib/auth-client";
import { Auth } from "./components/Auth";
import { Nav } from "./components/Nav";
import { Chat } from "./components/Chat";

function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Nav session={session} />
      <div className="p-12 flex flex-col items-center align-center justify-center min-h-screen">
        {session ? <Chat username={session.user.name} /> : <Auth />}
      </div>
    </div>
  );
}

export default App;
