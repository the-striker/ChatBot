import { gql, useSubscription, useMutation } from "@apollo/client";
import {nhost} from "./nhost";
import { useState } from "react"; 

const GET_MESSAGES = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
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

export default function ChatWindow({ chatId }) {
  const { data, loading } = useSubscription(GET_MESSAGES, {
    variables: { chat_id: chatId },
  });

  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [responseTimeout, setResponseTimeout] = useState(false);

  if (loading) return <p>Loading messages...</p>;

  const handleSend = async () => {
    const content = prompt("Enter your message:");
    if (!content) return;

    // Get current logged-in user
    const user = nhost.auth.getUser();
	setWaitingForResponse(true);
    setResponseTimeout(false);

    // ✅ After 5s, show warning
    const timeoutId = setTimeout(() => {
      setResponseTimeout(true);
    }, 5000);

    // Call Hasura Action -> triggers n8n
    await sendMessageAction({
      variables: { chat_id: chatId, content },
    });
	clearTimeout(timeoutId);
    setWaitingForResponse(false);
  };
return (
    <div>
      <h2>Chat {chatId}</h2>
      <div style={{ border: "1px solid gray", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {data.messages.map((msg) => (
          <p key={msg.id}>
            <b>{msg.role === "user" ? "You" : "Bot"}:</b> {msg.content}
          </p>
        ))}
		{waitingForResponse && <p><i>⏳ Waiting for response...</i></p>}
        {responseTimeout && <p style={{ color: "red" }}><i>⚠ Response is taking longer than usual...</i></p>}
      </div>
      <button onClick={handleSend}>Send Message</button>
      <button onClick={() => window.location.reload()}>⬅ Back to Chats</button>
    </div>
  );
}