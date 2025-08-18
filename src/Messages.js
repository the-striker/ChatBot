// Messages.js
import React, { useState, useEffect, useRef } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { nhost } from "./nhost";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const GET_MESSAGES = gql`
  subscription GetMessages($chatId: uuid!) {
    messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
      id
      content
      role
      created_at
    }
  }
`;
const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(
      object: { chat_id: $chat_id, content: $content, role: "user" }
    ) {
      id
      content
      role
      created_at
    }
  }
`;

const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chat_id: uuid!, $content: String!) {
    sendMessage(chat_id: $chat_id, content: $content) {
      message_id
      chat_id
      content
      role
      created_at
    }
  }
`;

export default function Messages({ chatId }) {
  const { data, loading, error } = useSubscription(GET_MESSAGES, {
    variables: { chatId },
  });

  const [messageInput, setMessageInput] = useState("");
  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
	messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	useEffect(() => {
    scrollToBottom();
  }, [data]);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleSend = async () => {
    if (!messageInput) return;
	
	
	
	await insertUserMessage({
    variables: { chat_id: chatId, content: messageInput },
  });
    // Call Hasura Action -> triggers n8n
    await sendMessageAction({
      variables: { chat_id: chatId, content: messageInput },
    }).catch(console.error);
	

    // Clear input box
    setMessageInput("");
  };

  return (
    <div>
      <h2>Messages</h2>

      {/* 9️⃣ Messages container */}
      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {data.messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                backgroundColor: msg.role === "user" ? "#DCF8C6" : "#ECECEC",
                padding: "8px 12px",
                borderRadius: "15px",
                maxWidth: "60%",
              }}
            >
			<ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
			  </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* 10️⃣ Auto-scroll target */}
      </div>

      {/* 11️⃣ Input & Send button */}
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
				}
			}}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSend}
          style={{ padding: "8px 16px", marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}