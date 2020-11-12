import Link from "next/link";
import { useEffect, useState } from "react";
import useSwr from "swr";

export default function Nav({ title }) {
  const { data, error } = useSwr(`/api/users/informations`);

  return (
    <nav>
      <ul className="flex justify-between items-center p-8">
        <li>
          <Link href="/">
            <a className="text-blue-500 no-underline">Accueil</a>
          </Link>
        </li>
        {title && <li>Nobody Games Alone</li>}
        <ul className="flex justify-between items-center space-x-4">
          {data && data.username ? (
            <li key={data.username}>
              <a href={`/dashboard`} className="btn-blue no-underline">
                {data.username}
              </a>
            </li>
          ) : null}
        </ul>
      </ul>
    </nav>
  );
}
