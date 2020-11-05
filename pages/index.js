import Nav from "../components/nav";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import useSWR from "swr";
import { fetcher } from "../utils/helpers";

export default function IndexPage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const cookies = parseCookies(document.cookie);
    if (cookies && cookies.username) {
      setUsername(cookies.username);
    }
  }, []);

  const { data: platforms, error } = useSWR(`/api/pages/landing`, fetcher);
  if (error) {
    console.warn(error);
  }

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
          {!!username ? (
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
                  {platform.games
                    .split("||")
                    .slice(0, 3)
                    .map((game) => {
                      return (
                        <span
                          key={`${platform.id}-${game}`}
                          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 text-center"
                        >
                          {game}
                        </span>
                      );
                    })}
                  {platform.games.split("||").length > 3 && (
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
              <li>Présenter qui joue a quel jeu</li>
              <li>Faire un gros bouton CTA</li>
              <li>Expliquer le concept du site</li>
              <li>
                Faire une page qui présente toutes les disponibilités d'un coup
              </li>
            </ul>
          </li>
          <li>
            <b>Wizard création de compte</b>
            <ul className="list-decimal pl-6">
              <li>
                Créer des utilisateur via un token stocké sur le local storage
                (on s'embete pas pour l'instant avec des comptes email/password
                - systeme de claim plus tard)
              </li>
              <li>
                Choisir des jeux via la rechercher IGDB et les stocker dans
                postgres s'ils n'existent pas
              </li>
              <li>Choisir des crénaux de disponibilité via un calendrier</li>
            </ul>
          </li>
          <li>
            <b>Dashboard utilisateur</b>
            <ul className="list-decimal pl-6">
              <li>Présenter mes jeux avec bouton pour en rajouter</li>
              <li>Présenter mes crénaux avec option pour en rajouter</li>
              <li>
                Afficher des propositions sur mes jeux et mes crénaux en
                fonction des autres utilisateurs
              </li>
            </ul>
          </li>
          <li>
            <b>Page jeu</b>
            <ul className="list-decimal pl-6">
              <li>
                Avoir une jolie page jeu publique qui présente les informations
              </li>
              <li>Montrer qui y joue et quand</li>
            </ul>
          </li>
          <li>
            <b>Technique</b>
            <ul className="list-decimal pl-6">
              <li>
                PRIO Améliorer la vue games/new pour pouvoir ajouter plusieurs
                jeux a la suite via plusieurs recherches
              </li>
              <li>PRIO Completer le CRUD des elements de base</li>
              <li>
                IMPORTANT Refacto les queries SQL pour utiliser les parametres
              </li>
              <li>
                Refacto la dashboard for etre une page statique et pour pouvoir
                marcher sans données
              </li>
              <li>
                PRIO Refactoriser les fetchs pour utiliser SWR et mettre en
                place de l'error handling et du loading
              </li>
              <li>
                Faire une footer avec des liens vers des pages platforms et
                games rassemblant toutes les données (SEO)
              </li>
            </ul>
          </li>
          <li>
            <b>A venir</b>
            <ul className="list-decimal pl-6">
              <li>FAIT Spécifier les plateformes pour chaque jeu</li>
              <li>Créer des crénaux récurents</li>
              <li>
                Un import steam selectif (on récupere tous les jeux et
                l'utilisateur check ceux qu'il ou elle veut importer)
              </li>
              <li>
                Permettre de claim un compte temporaire et créer des comptes
                classiques
              </li>
              <li>
                Mettre en place un systeme d'error reporting sur le serveur et
                les clients
              </li>
              <li>Installer un log sink via vercel</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
