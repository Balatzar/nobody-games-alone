import Layout from "../../components/layout";
import Nav from "../../components/nav";
import { useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import Head from "next/head";
import useSWR from "swr";
import { signIn } from "next-auth/client";

export default function UserNew() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { invite } = router.query;

  const { data: team, error } = useSWR(
    `/api/teams/informations?invite=${invite}`,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (error) {
    console.warn(error);
  }

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
        {invite && team ? (
          <>
            <h3 className="text-center text-4xl">Bienvenue !</h3>
            <p>
              Vous avez été invité(e) à rejoindre l'équipe{" "}
              <span className="font-bold">{team.name}</span> par{" "}
              <span className="font-bold">{team.name}</span>. Nobody Games Alone
              est un site pour trouver des disponibilités communes pour jouer
              entre amis ! Vous allez pouvoir créer votre compte en 2 minutes et
              voir les disponibilités de vos amis !
            </p>
          </>
        ) : null}
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
    </Layout>
  );
}
