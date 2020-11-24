import Layout from "../components/layout";
import Nav from "../components/nav";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";

export default function IndexPage() {
  const { data, error } = useSWR(`/api/pages/landing`);
  if (error) {
    console.warn(error);
  }

  const platforms = data ? data.platforms : [];
  const games = data ? data.games : [];

  return (
    <Layout>
      <Head>
        <title>Nobody Games Alone</title>
      </Head>
      <Nav />
      <div className="container mx-auto">
        <div className="container grid grid-cols-2 gap-4 items-center">
          <div className="illu">
            <Image
              src="/illu-landing.png"
              alt="Nobody Games Alone illustration"
              width={"1000"}
              height={"1000"}
            />
          </div>
          <div className="hero">
            <h1 className="text-5xl font-cursive text-blue-DEFAULT">
              Nobody Games Alone
            </h1>
            <h3 className="text-2xl">
              Un site pour trouver des gens avec qui jouer.
            </h3>
            <div className="justify-center pt-4 grid grid-cols-2 gap-4">
              {data && data.currentUser && data.currentUser.username ? (
                <Link href="/dashboard">
                  <a className="btn">Ma dashboard</a>
                </Link>
              ) : (
                <Link href="/users/new">
                  <a className="btn">C'est parti !</a>
                </Link>
              )}
            </div>
          </div>
          <div className="justify-center pt-4 flex">
            <Link href="/together">
              <a className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-center">
                Explorer
              </a>
            </Link>
          </div>
        </div>
        <h2 className="text-3xl text-center text-accent-1">
          Nos utilisateurs jouent sur...
        </h2>
        <div className="p-6 flex flex-wrap space-x-4">
          {platforms ? (
            platforms.map((platform) => {
              return (
                <div
                  key={platform.id}
                  className="card"
                  style={{
                    width: "300px",
                  }}
                >
                  <div className="px-6 py-4">
                    <Link href={`/platforms/${platform.slug}`}>
                      <div className="font-bold text-xl mb-2 text-center underline cursor-pointer">
                        <a>{platform.name}</a>
                      </div>
                    </Link>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    {platform.games.slice(0, 3).map((game) => {
                      return (
                        <Link
                          key={`${platform.id}-${game.id}`}
                          href={`/games/${game.slug}`}
                        >
                          <a className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 text-center cursor-pointer">
                            {game.name}
                          </a>
                        </Link>
                      );
                    })}
                    {platform.games.length > 3 && (
                      <Link href={`/platforms/${platform.slug}`}>
                        <div className="text-center underline cursor-pointer">
                          <a>Plus de jeux</a>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>Chargement...</p>
          )}
        </div>
        <h2 className="text-3xl text-center text-accent-1">
          Nos utilisateurs jouent à...
        </h2>
        <div className="p-5 flex flex-wrap space-x-4">
          {games ? (
            games.map((game) => {
              return (
                <Link key={game.id} href={`/games/${game.slug}`}>
                  <a>
                    <div className="card">
                      <Image
                        src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover_image_id}.jpg`}
                        width={game.cover_width}
                        height={game.cover_height}
                        className="w-full"
                      />
                      <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">
                          {game.name}
                        </div>
                        <p className="text-gray-700 text-base">
                          {game.summary.length > 100
                            ? `${game.summary.slice(0, 100)}...`
                            : game.summary}
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })
          ) : (
            <p>Chargement...</p>
          )}
        </div>
        <div className="container p-20">
          <h4 className="text-center underline">
            Ce qui doit etre mis en place :
          </h4>
          <ul className="list-disc pl-6">
            <li>
              <b>Landing</b>
              <ul className="list-decimal pl-6">
                <li>Présenter qui joue a quel jeu (quelques exemples)</li>
                <li>Expliquer le concept du site</li>
                <li>
                  Mettre des elements vides pendant que la page se load pour
                  eviter de decaller le contenu.
                </li>
              </ul>
            </li>
            <li>
              <b>Page d'ajout de jeux</b>
              <ul className="list-decimal pl-6">
                <li>Mettre les jeux selectionnés dans des pills</li>
              </ul>
            </li>
            <li>
              <b>Tchat</b>
              <ul className="list-decimal pl-6">
                <li>
                  Verifier que l'utilisateur a les droits de creation de message
                  (pour lui et pour team)
                </li>
                <li>
                  Refacto le composant de tchat pour etre independant (avec sa
                  propre API)
                </li>
                <li>Mettre un tchat sur les DM</li>
                <li>
                  Diffuser des notification / envoyer des mails quand il y a des
                  nouveaux messages a lire
                </li>
              </ul>
            </li>
            <li>
              <b>Teams</b>
              <ul className="list-decimal pl-6">
                <li>
                  Ajouter un{" "}
                  <a href="https://github.com/zpao/qrcode.react">QR code</a> sur
                  la page d'invitation
                </li>
                <li>
                  Ajouter un système de créneaux entre joueurs d'une team, avec
                  reminder mail/sms
                </li>
              </ul>
            </li>
            <li>
              <b>Technique</b>
              <ul className="list-decimal pl-6">
                <li>Faire une page de tchat global par team</li>
                <li>
                  Refacto les forms pour utiliser{" "}
                  <a href="https://formik.org/">Formik</a>
                </li>
                <li>
                  Faire une footer avec des liens vers des pages platforms et
                  games rassemblant toutes les données (SEO)
                </li>
                <li>
                  Refactor la creation des disponibilités pour supprimer
                  uniquement via diff et mettre en place un index sur start et
                  end pour l'unicité
                </li>
              </ul>
            </li>
            <li>
              <b>A venir</b>
              <ul className="list-decimal pl-6">
                <li>
                  Mettre en place les meta tags pour les previews de partage
                  (page landing - together - platform show)
                </li>
                <li>
                  Voir a l'utilisation s'il faut prioriser la mise en page d'une
                  page profil (trouver des inconnus pour jouer) ou la creation
                  d'une team ou d'evenements (jouer avec ses amis)
                </li>
                <li>Créer des crénaux récurents</li>
                <li>
                  Permettre de claim un compte temporaire et créer des comptes
                  classiques (a la discord)
                </li>
                <li>
                  Mettre en place un systeme d'error reporting sur le serveur et
                  les clients
                </li>
              </ul>
            </li>
            <li>
              <b>Gestion de projet</b>
              <ul className="list-decimal pl-6">
                <li>Bouger tous les tickets vers un trello</li>
                <li>
                  Ajouter dans la footer un lien pour rapporter un bogue et un
                  lien pour envoyer des idées (airtable)
                </li>
                <li>Créer un discord pour gerer le projet</li>
              </ul>
            </li>
            <li>
              <b>Admin</b>
              <ul className="list-decimal pl-6">
                <li>
                  Apres avoir mis en place des comptes mettre en place un
                  tableau admin avec tous les users et d'autres data
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
