import { parseCookies, setCookie } from "nookies";
import Head from "next/head";
import Nav from "../../components/nav";
import { useEffect, useState } from "react";

export default function UsersMigrate() {
  const [token, setToken] = useState("");
  useEffect(() => {
    const { temp_token } = parseCookies(document.cookie);
    setToken(temp_token);
  }, []);

  return (
    <>
      <Head>
        <title>Migration de compte - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Migration de compte</h3>
        <p>
          Cette fonctionnalité vous permet de migrer votre compte temporaire
          vers un autre ordinateur.
        </p>
        <div className="flex">
          <label className="w-2/5">
            Copiez ce code : <input value={token} readOnly />
          </label>
          <span className="w-1/5">>>>>>>>>>></span>
          <label className="w-2/5">
            Et collez le ici sur l'autre ordinateur :{" "}
            <input
              onBlur={(e) => {
                setCookie(null, "temp_token", e.target.value, {
                  maxAge: 10 * 365 * 24 * 60 * 60, // 10 years
                  path: "/",
                  sameSite: "strict",
                });
                location.reload();
              }}
            />
          </label>
        </div>
      </div>
    </>
  );
}
