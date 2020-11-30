import Layout from "../../components/layout";
import Nav from "../../components/nav";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
import { signIn } from "next-auth/client";
import { parseCookies } from "nookies";

export default function UserNew() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [invite, setInvite] = useState("");
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies(document.cookie);
    setInvite(cookies.invite_token);
  });

  async function submitUser(event) {
    event.preventDefault();
    if (!username) return;
    setLoading(true);

    const query = {
      method: "POST",
      body: JSON.stringify({ username, invite }),
    };

    const res = await fetch(`/api/users`, query);
    setLoading(false);
    if (res.ok) {
      router.push(`/games/new`);
    } else {
      console.warn(res);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Créer un utilisateur - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Choisissez un pseudonyme</h3>
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
    </Layout>
  );
}
