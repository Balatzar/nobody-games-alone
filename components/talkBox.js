import { useState } from "react";
import useSWR, { mutate } from "swr";

export default function TalkBox({
  currentTeam,
  users,
  currentUser,
  currentGroup,
}) {
  const dataUrl = currentTeam
    ? `/api/messages/team?id=${currentTeam.id}`
    : `/api/messages/group?id=${currentGroup.id}`;
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { data, error } = useSWR(dataUrl, {
    refreshInterval: 2000,
  });

  const messages = data || [];

  const saveMessage = async (e) => {
    e.preventDefault();
    if (!message) return;
    setLoading(true);

    const body = currentTeam
      ? { message, teamId: currentTeam.id }
      : { message, groupId: currentGroup.id };

    const query = {
      method: "POST",
      body: JSON.stringify(body),
    };

    const res = await fetch(`/api/messages`, query);
    const data = await res.json();

    setLoading(false);

    if (res.status === 200) {
      setMessage("");
      mutate(dataUrl);
    } else {
      console.warn(data);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/6">
        <ul>
          {users.map(({ username }) => {
            return <li key={username}>{username}</li>;
          })}
        </ul>
      </div>
      <div className="w-5/6">
        <ul>
          {messages.map((message, i) => {
            return (
              <li key={i}>
                <b>{message.username} : </b>
                {message.body}
              </li>
            );
          })}
        </ul>
        <form onSubmit={saveMessage}>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
                type="submit"
              >
                Envoyer
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
