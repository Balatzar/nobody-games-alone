import Link from "next/link";

const links = [
  // { href: 'https://github.com/vercel/next.js', label: 'GitHub' },
  // { href: 'https://nextjs.org/docs', label: 'Docs' },
];

export default function Nav({ title }) {
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
        </ul>
      </ul>
    </nav>
  );
}
