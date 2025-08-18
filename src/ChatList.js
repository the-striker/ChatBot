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
    insert_chats_one(object: { title: $title }) {
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
    const existing = cache.readQuery({ query: GET_CHATS });
	
    if (existing && existing.chats) {
      cache.writeQuery({
        query: GET_CHATS,
        data: {
          chats: [insert_chats_one, ...existing.chats],
        },
      });
    } else {
      cache.writeQuery({
        query: GET_CHATS,
        data: {
          chats: [insert_chats_one],
        },
      });
    }
  },
})


  if (loading) return <p>Loading chats...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
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
    <div>
      <h2>Your Chats</h2>
	  <button onClick={handleNewChat}>➕ New Chat</button>
      <ul>
        {data.chats.map((chat) => (
          <li key={chat.id}>
            <button onClick={() => onSelectChat(chat.id)}>{chat.title}</button>
          </li>
        ))}
      </ul>
	  <input
  type="text"
  placeholder="New chat title..."
  value={newChatTitle}
  onChange={(e) => setNewChatTitle(e.target.value)}
/>
<button onClick={handleCreateChat}>Create Chat</button>
    </div>
  );
}