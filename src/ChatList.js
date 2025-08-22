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
    <div
      style={{
        width: "280px",
        background: "#202123", 
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#ECECEC",
        borderRight: "1px solid #2A2B32",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #2A2B32",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        <span>💬 Chats</span>
        <button
          onClick={handleNewChat}
          style={{
            background: "#343541",
            border: "1px solid #565869",
            borderRadius: "6px",
            color: "#ECECEC",
            fontSize: "14px",
            padding: "4px 8px",
            cursor: "pointer",
            transition: "background 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#40414F")}
          onMouseLeave={(e) => (e.target.style.background = "#343541")}
        >
          ➕
        </button>
      </div>

      {/* Chat list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {data.chats.map((chat) => {
            const isActive = selectedChat === chat.id;
            return (
              <li
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                style={{
                  padding: "12px 14px",
                  cursor: "pointer",
                  backgroundColor: isActive ? "#343541" : "transparent",
                  borderLeft: isActive ? "3px solid #10A37F" : "3px solid transparent",
                  transition: "background-color 0.2s, border-left 0.2s",
                }}
                onMouseEnter={(e) =>
                  !isActive && (e.currentTarget.style.backgroundColor = "#2A2B32")
                }
                onMouseLeave={(e) =>
                  !isActive && (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#ECECEC",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {chat.title || "Untitled Chat"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8E8EA0",
                    marginTop: "2px",
                  }}
                >
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
