// ChatList.js
import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { nhost } from './nhost';

const GET_CHATS = gql`
  query GetChats($userId: uuid!) {
    chats(where: { user_id: { _eq: $userId } }, order_by: { created_at: desc }) {
      id
      title
      created_at
    }
  }
`;
const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title}) {
      id
      title
      created_at
    }
  }
`;

 export default function ChatList({ onSelectChat }) {
  const { data, loading, error } = useQuery(GET_CHATS, {
  variables: { userId: nhost.auth.getUser()?.id },
});
	const [newChatTitle, setNewChatTitle] = useState("");
	const [createChat] = useMutation(CREATE_CHAT, {
	update(cache, { data: { insert_chats_one } }) {
	const userId = nhost.auth.getUser()?.id;
	const existing = cache.readQuery({
      query: GET_CHATS,
      variables: { userId },
    });
	
    if (existing && existing.chats) {
      cache.writeQuery({
        query: GET_CHATS,
		variables: { userId },
        data: {
          chats: [insert_chats_one, ...existing.chats],
        },
      });
    } else {
      cache.writeQuery({
        query: GET_CHATS,
		variables: { userId },
        data: {
          chats: [insert_chats_one],
        },
      });
    }
  },
});


  if (loading) return <p className="text-gray-500 p-4">Loading chats...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error.message}</p>;
  
  const handleNewChat = async () => {
    const title = prompt("Enter chat title:");
    if (title) {
      await createChat({ variables: { title } });
    }
  };
  const handleCreateChat = async () => {
  if (!newChatTitle) return;

  await createChat({ variables: { title: newChatTitle } });
  setNewChatTitle(''); // clear input field
};
  
return (
    <div style={{ width: "280px", borderRight: "1px solid #ddd", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "12px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>💬 Chats</h3>
        <button onClick={handleNewChat} style={{ fontSize: "14px", padding: "4px 8px", cursor: "pointer" }}>
          ➕
        </button>
      </div>

      {/* Chat list */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, overflowY: "auto" }}>
        {data.chats.map((chat) => (
          <li
            key={chat.id}
            style={{
              borderBottom: "1px solid #f0f0f0",
              padding: "10px 12px",
              cursor: "pointer",
            }}
            onClick={() => onSelectChat(chat.id)}
          >
            <div style={{ fontWeight: "500", fontSize: "14px" }}>{chat.title || "Untitled Chat"}</div>
            <div style={{ fontSize: "12px", color: "gray" }}>
              {new Date(chat.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {/* Input for new chat */}
      <div style={{ padding: "10px", borderTop: "1px solid #ddd" }}>
        <input
          type="text"
          placeholder="New chat title..."
          value={newChatTitle}
          onChange={(e) => setNewChatTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "6px",
            marginBottom: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleCreateChat}
          style={{
            width: "100%",
            padding: "6px",
            border: "none",
            background: "#4CAF50",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Chat
        </button>
      </div>
    </div>
  );
}