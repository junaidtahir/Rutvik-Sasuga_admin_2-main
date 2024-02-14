import React, { useState, useEffect } from "react";
import { auth,db } from "../../../Firebase";
import { addDoc, collection, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from 'react-i18next';


export default function SendMessage({selectedChat, spanRef, userFCMTOken}) {
  const { t } = useTranslation();
    const [message, setMessage] = useState("");
    const [height, setHeight] = useState("45px");
  const [user] = useAuthState(auth);
  
  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    
    // to increment message count for mobile app
    const chatRef = doc(db, "chatroom", user.uid, "chats", selectedChat.selectedUser );

    // Atomically increment the population of the city by 50.
    await updateDoc(chatRef, {
      app_message_count : increment(1)
    });
    console.log(userFCMTOken)
    // to send notification with api to app token
    fetch('https://us-central1-sasuga-d222e.cloudfunctions.net/sendNotification', {
      "method": 'POST',
      "headers": {
        'Content-Type': 'application/json',
        'Accept' : 'application/json',
      },
      "body": JSON.stringify({
        "message": message,
        "registrationToken": userFCMTOken,
        "title": 'Admin',
        "image":"",
    "mobile_number":"",
    "email":""
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }).then((responseJson) => {
      // setModalOpen(false);startCall(); console.log("Notification send ",responseJson)
      console.log(responseJson)
    })
    .catch((error) => {console.error(error)});



    const newMessageCollection = collection(db,`chatroom/${user.uid}/chats/${selectedChat.selectedUser}/messages`);
    await addDoc(newMessageCollection, {
      message: message,
      createdAt: serverTimestamp(),
      sender:user.uid,
    });
    setMessage("");
    spanRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (message.length === 0) {
      setHeight("45px")
    }
  }, [message]);

  const onEnterPress = (e) => {
    if (e.target.scrollHeight < 100) {
      setHeight(e.target.scrollHeight);
    }
    if(e.keyCode === 13) {
      if (e.shiftKey === false) {
        e.preventDefault();
        sendMessage(e)
        setHeight("45px")
      }
    }
  }

    return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
        <label htmlFor="messageInput" hidden>
        {t('EnterMessage.EnterMessage')}
        </label>
        <textarea
          id="messageInput"
          name="messageInput"
          type="text"
          className="form-input__input send-message-text-area"
          placeholder="type message..."
          value={message}
          style={{
            width: "530px",
            padding: "10px",
            borderRadius: "21px",
            height: height
          }}
          onKeyDown={onEnterPress}
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* <button type="submit">Send</button> */}
    </form>
    );
}