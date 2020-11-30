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

  if (invite) {
    setCookie(null, "invite_token", invite, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }

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

  return (
    <Layout>
      <Head>
        <title>Bienvenue - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        {invite && team ? (
          <>
            <h3 className="text-center text-4xl">Bienvenue !</h3>
            <p>
              Vous avez été invité(e) à rejoindre l'équipe{" "}
              <span className="font-bold">{team.name}</span> par{" "}
              <span className="font-bold">{team.username}</span>. Nobody Games
              Alone est un site pour trouver des disponibilités communes pour
              jouer entre amis ! Vous allez pouvoir créer votre compte en 2
              minutes et voir les disponibilités de vos amis !
            </p>
          </>
        ) : (
          <p>Chargement...</p>
        )}
        <h3 className="text-center text-2xl">Choisissez un pseudonyme</h3>
        <div className="justify-center pt-4 grid grid-cols-2 gap-4">
          <a onClick={signIn} className="btn cursor-pointer">
            C'est parti !
          </a>
        </div>
      </div>
    </Layout>
  );
}
