import Link from "next/link";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

const links = [
  // { href: 'https://github.com/vercel/next.js', label: 'GitHub' },
  // { href: 'https://nextjs.org/docs', label: 'Docs' },
];

export default function Nav({ title }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const cookies = parseCookies(document.cookie);
    if (cookies && cookies.username) {
      setUsername(cookies.username);
    }
  });

  return (
    <nav>
      <ul className="flex justify-between items-center p-8">
        <li>
          <Link href="/">
            <a className="text-blue-500 no-underline">Home</a>
          </Link>
        </li>
        {title && <li>Nobody Games Alone</li>}
        <ul className="flex justify-between items-center space-x-4">
          {links.map(({ href, label }) => (
            <li key={`${href}${label}`}>
              <a href={href} className="btn-blue no-underline">
                {label}
              </a>
            </li>
          ))}
          {!!username && (
            <li key={username}>
              <a href={`/dashboard`} className="btn-blue no-underline">
                {username}
              </a>
            </li>
          )}
        </ul>
      </ul>
    </nav>
  );
}
