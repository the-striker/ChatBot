import React from "react";
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

export default function ChatList({ onSelectChat, selectedChat }) {
  const { data, loading, error } = useQuery(GET_CHATS, {
    variables: { userId: nhost.auth.getUser()?.id },
  });

  const [createChat] = useMutation(CREATE_CHAT, {
    update(cache, { data: { insert_chats_one } }) {
      const userId = nhost.auth.getUser()?.id;
      const existing = cache.readQuery({
        query: GET_CHATS,
        variables: { userId },
      });

      const newChats = existing?.chats ? [insert_chats_one, ...existing.chats] : [insert_chats_one];
      cache.writeQuery({
        query: GET_CHATS,
        variables: { userId },
        data: { chats: newChats },
      });
    },
  });

  if (loading) return <p style={{ padding: "12px", color: "#888" }}>Loading chats...</p>;
  if (error) return <p style={{ padding: "12px", color: "#f44336" }}>Error: {error.message}</p>;

  const handleNewChat = async () => {
    const title = prompt("Enter chat title:");
    if (title) {
      await createChat({ variables: { title } });
    }
  };

  return (
    <div style={{ 
      width: "280px", 
      background: "#1E1E1E", 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      color: "#E5E5E5" 
    }}>
      {/* Header */}
      <div style={{ padding: "12px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>💬 Chats</h3>
        <button 
          onClick={handleNewChat} 
          style={{ fontSize: "14px", padding: "4px 8px", cursor: "pointer", background: "#4CAF50", border: "none", color: "#fff", borderRadius: "4px" }}
        >
          ➕
        </button>
      </div>

      {/* Chat list */}
	  <div style={{ 
			flex: 1, // take full height minus header
			overflowY: "auto" // independent vertical scroll
		}}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {data.chats.map((chat) => {
          const isActive = selectedChat === chat.id;
          return (
            <li
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              style={{
                borderBottom: "1px solid #333",
                padding: "10px 12px",
                cursor: "pointer",
                backgroundColor: isActive ? "#333" : "transparent",
                transition: "background-color 0.2s",
              }}
            >
              <div style={{ fontWeight: "500", fontSize: "14px", color: isActive ? "#fff" : "#E5E5E5" }}>
                {chat.title || "Untitled Chat"}
              </div>
              <div style={{ fontSize: "12px", color: isActive ? "#bbb" : "#888" }}>
                {new Date(chat.created_at).toLocaleString()}
              </div>
            </li>
          );
        })}
      </ul>
	  </div>
    </div>
  );
}
