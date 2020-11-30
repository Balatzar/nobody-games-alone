import Layout from "../../../components/layout";
import Nav from "../../../components/nav";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
const db = require("../../../db");

export async function getServerSideProps(context) {
  const fetchTeam = await db.query(
    `
    SELECT name, invite_token, id FROM teams
    WHERE id = $1;
  `,
    [context.params.id]
  );
  const currentTeam = fetchTeam.rows[0];

  const data = {
    props: {
      currentTeam,
    },
  };
  return data;
}

export default function TimeslotsInvite({ currentTeam }) {
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitEmails = async () => {
    setLoading(true);
    const query = {
      method: "POST",
      body: JSON.stringify({
        emails,
        id: currentTeam.id,
      }),
    };

    const res = await fetch(`/api/teams/invite`, query);
    if (res.status === 200) {
      router.push(`/teams/${currentTeam.id}`);
    } else {
      setLoading(false);
      const error = await res.json();
      console.warn(error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Inviter des amis - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">{currentTeam.name}</h3>
        <h3 className="text-center text-1xl">Inviter des amis</h3>
        <div className="p-4 h-20">
          {emails.map((email, i) => (
            <button
              key={i}
              onClick={() =>
                setEmails((emails) => [
                  ...emails.slice(0, i),
                  ...emails.slice(i + 1),
                ])
              }
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-1"
            >
              {email} | X
            </button>
          ))}
        </div>
        <p>
          DEV Attention ne pas mettre d'addresses random car les mails seront
          vraiment envoyés
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setEmails((emails) => [...emails, currentEmail]);
            setCurrentEmail("");
          }}
        >
          <label>
            Email
            <input
              type="email"
              name="email"
              value={currentEmail}
              onChange={(event) => {
                setCurrentEmail(event.target.value);
              }}
            />
          </label>

          <input
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 px-2 rounded text-center border-l-8"
            type="submit"
            value="Ajouter"
          />
        </form>
      </div>

      <footer className="bg-white justify-center p-4 flex fixed w-full bottom-0 h-32">
        {loading ? (
          <span>Chargement...</span>
        ) : (
          <button
            type="button"
            disabled={!emails.length}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center absolute ${
              !emails.length && "opacity-50 cursor-not-allowed"
            }`}
            onClick={submitEmails}
          >
            Envoyer les invitations
          </button>
        )}
        <p className="absolute" style={{ top: "70px" }}>
          Ou partagez ce lien :{" "}
          <span className="underline">
            {process.env.NEXT_PUBLIC_DOMAIN_URL}/users/welcome?invite=
            {currentTeam.invite_token}
          </span>
        </p>
      </footer>
    </Layout>
  );
}
