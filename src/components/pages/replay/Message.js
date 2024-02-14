import React from "react";
import { auth } from "../../../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Message({ message }) {
  const [user] = useAuthState(auth);
  // should be:
  // text: message,
  // name: displayName,
  // avatar: photoURL,
  // createdAt: serverTimestamp(),
  // uid,
  return (
    <div className={`chat-bubble ${message.sender === user.uid ? "right" : "left"}`}>
      {/* <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      /> */}
      <div className="chat-bubble__right">
        {/* <p className="user-name">{message.sender}</p> */}
        <p className="user-message">{message.message}</p>
      </div>
    </div>
  )
}
