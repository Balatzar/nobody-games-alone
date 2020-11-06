import Nav from "../../components/nav";
import { useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import Head from "next/head";

export default function UserNew() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submitUser(event) {
    event.preventDefault();
    if (!username) return;
    setLoading(true);

    const query = {
      method: "POST",
      body: JSON.stringify({ username }),
    };

    const res = await fetch(`/api/users`, query);
    const data = await res.json();
    const { temp_token, username: savedusername } = data[0];
    setCookie(null, "temp_token", temp_token, {
      maxAge: 10 * 365 * 24 * 60 * 60, // 10 years
      path: "/",
      sameSite: "strict",
    });
    setCookie(null, "username", savedusername, {
      maxAge: 10 * 365 * 24 * 60 * 60, // 10 years
      path: "/",
      sameSite: "strict",
    });
    router.push(`/games/new`);
  }

  return (
    <>
      <Head>
        <title>Créer un utilisateur - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Choisissez un pseudonyme</h3>
        <p>Votre compte sera stocké en cookie sur votre ordinateur</p>
        <form onSubmit={submitUser}>
          <label>Pseudonyme</label>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <input
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 px-2 rounded text-center border-l-8"
                type="submit"
                value="Créer"
              />
            </>
          )}
        </form>
      </div>
    </>
  );
}
