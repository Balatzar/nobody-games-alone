import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSwr from "swr";
import { signIn, signOut, useSession } from "next-auth/client";

export default function Nav({ title }) {
  const { data, error } = useSwr(`/api/users/informations`);
  const [session, loading] = useSession();

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
          {data && data.username ? (
            <li key={data.username}>
              <a href={`/dashboard`} className="btn-blue no-underline">
                {data.username}
              </a>
            </li>
          ) : null}
          <li>
            {!session && (
              <>
                <button onClick={signIn}>Sign in</button>
              </>
            )}
            {session && (
              <>
                Signed in as {session.user.email} <br />
                <button onClick={signOut}>Sign out</button>
              </>
            )}
          </li>
        </ul>
      </ul>
    </nav>
  );
}
