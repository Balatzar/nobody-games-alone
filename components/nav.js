import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSwr from "swr";
import { signIn, signOut, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

export default function Nav({ title }) {
  const [session, loading] = useSession();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <nav className="navbar bg-opacity-80">
      <ul className="flex justify-between items-center p-4">
        <li>
          <Link href="/">
            <a>
              <Image
                src="/nobodygamesalone-logo.svg"
                alt="Nobody Games Alone logo"
                width={94}
                height={40}
              />
            </a>
          </Link>
        </li>
        <ul className="flex justify-between items-center space-x-4">
          <li>
            <Link href={router.asPath} locale={"fr"}>
              <a>Français</a>
            </Link>
          </li>
          <li>
            <Link href={router.asPath} locale={"en"}>
              <a>English</a>
            </Link>
          </li>
          {!loading && session?.user ? (
            <li>
              <a href={`/dashboard`} className="btn-blue no-underline">
                {session?.user?.username || session?.user?.email}
              </a>
              <br />
              <button onClick={() => signOut({ callbackUrl: "/" })}>
                {t("common:logout")}
              </button>
            </li>
          ) : (
            <button onClick={signIn}>{t("common:login")}</button>
          )}
        </ul>
      </ul>
    </nav>
  );
}
