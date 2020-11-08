import Nav from "../components/nav";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";

export default function IndexPage() {
  const { data, error } = useSWR(`/api/pages/landing`);
  if (error) {
    console.warn(error);
  }

  const platforms = data ? data.platforms : [];

  return (
    <div>
      <Head>
        <title>Nobody Games Alone</title>
      </Head>
      <Nav />
      <div className="py-20 bg-gray-200">
        <h1 className="text-5xl text-center text-accent-1">
          Nobody Games Alone
        </h1>
        <h3 className="text-center text-2xl">
          Un site pour trouver des gens avec qui jouer.
        </h3>
        <div className="justify-center pt-4 flex">
          {data && data.currentUser && data.currentUser.username ? (
            <Link href="/dashboard">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center">
                Ma dashboard
              </button>
            </Link>
          ) : (
            <Link href="/users/new">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center">
                C'est parti !
              </button>
            </Link>
          )}
        </div>
        <div className="justify-center pt-4 flex">
          <Link href="/together">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-center">
              Explorer
            </button>
          </Link>
        </div>
      </div>
      <h2 className="text-3xl text-center text-accent-1">
        Nos utilisateurs jouent sur...
      </h2>
      <div className="p-5 flex flex-wrap space-x-4">
        {platforms ? (
          platforms.map((platform) => {
            return (
              <div
                key={platform.id}
                className="max-w-sm rounded overflow-hidden shadow-lg"
                style={{
                  width: "300px",
                }}
              >
                <div className="px-6 py-4">
                  <Link href={`/platforms/${platform.slug}`}>
                    <div className="font-bold text-xl mb-2 text-center underline cursor-pointer">
                      {platform.name}
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
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 text-center cursor-pointer">
                          {game.name}
                        </span>
                      </Link>
                    );
                  })}
                  {platform.games.length > 3 && (
                    <Link href={`/platforms/${platform.slug}`}>
                      <div className="text-center underline cursor-pointer">
                        Plus de jeux
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
      <div className="container p-20">
        <h4 className="text-center underline">
          Ce qui doit etre mis en place :
        </h4>
        <ul className="list-disc pl-6">
          <li>
            <b>Index</b>
            <ul className="list-decimal pl-6">
              <li className="underline">Mettre quelques jeux en avant</li>
              <li>Présenter qui joue a quel jeu (quelques exemples)</li>
              <li>Expliquer le concept du site</li>
            </ul>
          </li>
          <li>
            <b>Dashboard utilisateur</b>
            <ul className="list-decimal pl-6">
              <li>
                Creation des jeux : mettre les jeux selectionnés dans des pills
              </li>
              <li className="underline">
                Rendre plus clair qui joue a quoi depuis ma dashboard (page de
                comparaison ?)
              </li>
            </ul>
          </li>
          <li>
            <b>Technique</b>
            <ul className="list-decimal pl-6">
              <li>Ajouter des created_at a tous les objets</li>
              <li>
                IMPORTANT Refacto les queries SQL pour utiliser les parametres
              </li>
              <li>
                Faire une footer avec des liens vers des pages platforms et
                games rassemblant toutes les données (SEO)
              </li>
              <li>
                Refactor la creation des disponibilités pour supprimer
                uniquement via diff et mettre en place un index sur start et end
                pour l'unicité
              </li>
            </ul>
          </li>
          <li>
            <b>A venir</b>
            <ul className="list-decimal pl-6">
              <li>
                Mettre en place les meta tags pour les previews de partage (page
                landing - together - games show - platform show)
              </li>
              <li className="underline">
                Mettre en place la notion d'équipe qui permet de rassembler
                plusieurs utilisateurs et créer une dashboard spécifique avec
                les dispo de tous les membres de l'equipe
              </li>
              <li>
                Voir a l'utilisation s'il faut prioriser la mise en page d'une
                page profil (trouver des inconnus pour jouer) ou la creation
                d'une team ou d'evenements (jouer avec ses amis)
              </li>
              <li>Créer des crénaux récurents</li>
              <li>
                Un import steam selectif (on récupere tous les jeux et
                l'utilisateur check ceux qu'il ou elle veut importer)
              </li>
              <li>
                Permettre de claim un compte temporaire et créer des comptes
                classiques (a la discord)
              </li>
              <li>
                Mettre en place un systeme d'error reporting sur le serveur et
                les clients
              </li>
              <li className="underline">
                Mettre en place une fonction pour exporter le cookie
                d'authentification
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
