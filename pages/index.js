import Layout from "../components/layout";
import Nav from "../components/nav";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";
import { signIn } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";

export default function IndexPage() {
  const { t } = useTranslation();

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
      <div className="container mx-auto page">
        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="illu">
            <Image
              src="/illu-landing.png"
              alt="Nobody Games Alone illustration"
              width={1000}
              height={1000}
            />
          </div>
          <div className="hero">
            <h1 className="text-5xl font-cursive text-blue-DEFAULT">
              Nobody Games Alone
            </h1>
            <h3 className="text-2xl">{t("landing:title")}</h3>
            <div className="justify-center pt-4 grid grid-cols-2 gap-4">
              {data && data.currentUser && data.currentUser.email ? (
                <Link href="/dashboard">
                  <a className="btn">{t("landing:button-dashboard")}</a>
                </Link>
              ) : (
                <a onClick={signIn} className="btn cursor-pointer">
                  {t("landing:button-signup")}
                </a>
              )}
            </div>
          </div>
          <div className="justify-center pt-4 flex"></div>
        </div>
        <div className="container-sm mx-auto grid grid-cols-2 gap-4 items-center">
          <div className="text">
            <h3 className="text-2xl text-right">{t("landing:explore")}</h3>
            <div className="justify-center pt-4 grid grid-cols-2 gap-4">
              <p>&nbsp;</p>
              <Link href="/together">
                <a className="btn bg-blue-DEFAULT text-purple-DEFAULT">
                  {t("landing:button-explore")}
                </a>
              </Link>
            </div>
          </div>
          <div className="illu">
            <Image
              src="/explore.png"
              alt="Nobody Games Alone illustration"
              width={1000}
              height={900}
            />
          </div>
        </div>
        <h2 className="text-3xl text-center text-accent-1">
          {t("landing:user-play")}
        </h2>
        <div className="flex flex-wrap space-x-4 py-8">
          {platforms ? (
            platforms.map((platform) => {
              return (
                <div key={platform.id} className="card flex-1">
                  <div className="px-6 py-4">
                    <Link href={`/platforms/${platform.slug}`}>
                      <div className="font-cursive font-bold text-xl mb-2 text-center cursor-pointer">
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
                          <a className="inline-block text-center cursor-pointer">
                            {game.name}
                          </a>
                        </Link>
                      );
                    })}
                    {platform.games.length > 3 && (
                      <Link href={`/platforms/${platform.slug}`}>
                        <a className="btn small w-full">
                          {t("landing:more-games")}
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>{t("common:loading")}</p>
          )}
        </div>
        <h2 className="text-3xl text-center text-accent-1">
          {t("landing:user-games")}
        </h2>
        <div className="flex flex-wrap space-x-4 py-8">
          {games ? (
            games.map((game) => {
              return (
                <Link key={game.id} href={`/games/${game.slug}`}>
                  <div className="card flex-none md:flex-1">
                    <Image
                      src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover_image_id}.jpg`}
                      width={game.cover_width}
                      height={game.cover_height}
                      className="w-full"
                    />
                  </div>
                </Link>
              );
            })
          ) : (
            <p>{t("common:loading")}</p>
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
                <li>
                  Sur la page welcome ajouter les jeux des gens dans la team
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
