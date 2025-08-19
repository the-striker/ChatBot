import React, { useState, useEffect, useRef } from "react";
import { useSubscription, useMutation, gql } from "@apollo/client";
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

  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);

  const [messageInput, setMessageInput] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [responseTimeout, setResponseTimeout] = useState(false);
  const [isUserMessageSent, setIsUserMessageSent] = useState(false);
  const [lastUserMessageId, setLastUserMessageId] = useState(null);

  const timeoutRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom on new messages or waiting indicators
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [data?.messages, waitingForResponse, responseTimeout]);

  // Detect bot reply → stop waiting
  useEffect(() => {
  if (!data?.messages?.length || !lastUserMessageId) return;

  const lastMsg = data.messages[data.messages.length - 1];
  const lastUserMsg = data.messages.find((m) => m.id === lastUserMessageId);

  // Only stop waiting if bot replied after the user’s last message
  if (
    lastMsg.role === "bot" &&
    lastUserMsg &&
    new Date(lastMsg.created_at) > new Date(lastUserMsg.created_at)
  ) {
    setWaitingForResponse(false);
    setResponseTimeout(false);
    setIsUserMessageSent(false);
    setLastUserMessageId(null);
    clearTimeout(timeoutRef.current);
  }
}, [data?.messages, lastUserMessageId]);

  const handleSend = () => {
    if (!messageInput.trim()) return;

    const contentToSend = messageInput.trim();
    setMessageInput(""); // clear input immediately
   
    setResponseTimeout(false);
    setIsUserMessageSent(true);

    // timeout fallback
    timeoutRef.current = setTimeout(() => {
      setResponseTimeout(true);
    }, 15000);

    // send both mutations in parallel
    insertUserMessage({
  variables: { chat_id: chatId, content: contentToSend },
})
  .then((res) => {
    if (res?.data?.insert_messages_one?.id) {
      setLastUserMessageId(res.data.insert_messages_one.id);
	   setWaitingForResponse(true);
    }
  })
  .catch(console.error);

    sendMessageAction({
      variables: { chat_id: chatId, content: contentToSend },
    }).catch(console.error);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        background: "#121212",
        color: "#E5E5E5",
        minHeight: 0,
      }}
    >
      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          padding: "12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          minHeight: 0,
        }}
      >
        {loading && (
          <div style={{ color: "#AAA", padding: "12px" }}>Loading messages...</div>
        )}
        {error && (
          <div style={{ color: "red", padding: "12px" }}>
            Error: {error.message}
          </div>
        )}

        {data?.messages?.map((msg) => (
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
                backgroundColor: msg.role === "user" ? "#4CAF50" : "#2C2C2C",
                color: msg.role === "user" ? "#fff" : "#E5E5E5",
                padding: "8px 12px",
                borderRadius: "15px",
                maxWidth: "60%",
                boxShadow:
                  msg.role === "user"
                    ? "0 2px 4px rgba(0,0,0,0.3)"
                    : "none",
                wordBreak: "break-word",
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {waitingForResponse && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                backgroundColor: "#2C2C2C",
                color: "#AAA",
                padding: "8px 12px",
                borderRadius: "15px",
                maxWidth: "60%",
                fontStyle: "italic",
              }}
            >
              ⏳ Waiting for response...
            </div>
          </div>
        )}

        {responseTimeout && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                backgroundColor: "#FEEFB3",
                color: "#9C6500",
                padding: "8px 12px",
                borderRadius: "15px",
                maxWidth: "60%",
                fontStyle: "italic",
              }}
            >
              ⚠ Response is taking longer than usual...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #333",
          flexShrink: 0,
        }}
      >
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
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#1E1E1E",
            color: "#E5E5E5",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 16px",
            marginLeft: "10px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
