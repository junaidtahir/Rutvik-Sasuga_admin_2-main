import React, { useEffect, useRef, useState } from "react";
import { Callicon } from "../../../assets/icons";
import image_audio_call_start from "../../../assets/images/image_audio_call_start.png";
import image_video_call from "../../../assets/images/image_video_call.png";
import {
  query,
  collection,
  getDocs,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db, auth } from "../../../Firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { useAuthState } from "react-firebase-hooks/auth";
import Modal from "react-modal";
import VideoCalling from "../../../VideoCalling.tsx";
import { doc, setDoc, updateDoc, increment } from "firebase/firestore";

const appRoot = document.getElementById("root"); // Replace 'root' with the actual root element id

Modal.setAppElement(appRoot);
const customStyles = {
  overlay: {
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Transparent background
  },
  content: {
    // padding: 0, // Remove padding
    // margin: 0, // Center horizontally
    maxWidth: "100%", // Optional: set a maximum width for the modal
    width: "100%", // Optional: make the modal responsive
    border: "none", // Remove border (if any)
    background: "transparent", // Transparent background
    display: "flex", // Use flexbox for vertical centering
    alignItems: "center", // Center vertically
    justifyContent: "center", // Center horizontally
  },
};
const Chat = ({
  selectedChat,
  userFCMTOken,
  userTitle,
  userEmailAudio,
  userPhoneNumberAudio,
  userImageAudio,
}) => {
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [callType, setCallType] = useState("Audio");
  const spanRef = useRef(null);
  const [user] = useAuthState(auth);
  const [videoCall, setVideoCall] = useState(false);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(
          db,
          "chatroom/" +
            user.uid +
            "/chats/" +
            selectedChat.selectedUser +
            "/messages"
        )
      );
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedMessages = [];
        QuerySnapshot.forEach((doc) => {
          fetchedMessages.push({ ...doc.data(), id: doc.id });
        });
        const sortedMessages = fetchedMessages.sort(
          (a, b) => a.createdAt - b.createdAt
        );

        setMessages(sortedMessages);
        if (spanRef.current) {
          spanRef.current.scrollIntoView({ behavior: "smooth" });
        }
      });
      return () => unsubscribe;
    }
  }, [user, selectedChat]);
  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function scrollToBottom() {
    if (spanRef.current) {
      spanRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  const onCallStartAudioVideo = () => {
    setModalOpen(true);
  };
  const closeModalOnOutsideClick = (event) => {
    if (modalOpen && !event.target.closest(".your-modal-class")) {
      setModalOpen(false);
    }
  };
  useEffect(() => {
    if (modalOpen) {
      document.addEventListener("mousedown", closeModalOnOutsideClick);
    } else {
      document.removeEventListener("mousedown", closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", closeModalOnOutsideClick);
    };
  }, [modalOpen]);

  const callAudioVideoApi = async (type) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const chatRef = doc(
          db,
          "chatroom",
          user.uid,
          "chats",
          selectedChat.selectedUser
        );
        await updateDoc(chatRef, {
          app_call_count: increment(1),
        });
        setCallType(type);
        fetch(
          "https://us-central1-sasuga-d222e.cloudfunctions.net/sendNotification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              message: type,
              registrationToken: userFCMTOken,
              title: "Admin",
              image: "",
              mobile_number: "",
              email: "",
            }),
          }
        )
          .then((response) => {
            console.log("responseresponse", response);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((responseJson) => {
            setModalOpen(false);
            startCall();
            console.log("Notification send ", responseJson);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        alert("Please allow Microphone permission");
        return;
      }
    } catch (error) {
      alert("Please allow Camera permission");
      return;
    }
  };
  const startCall = async () => {
    const callRef = doc(db, "call", "hO01sqCg552JEdhQMGae");
    await setDoc(callRef, { isCalling: true }, { merge: true }).then(
      async (docSnap) => {
        console.log("Call popup done start");
      }
    );
    setVideoCall(true);
  };

  return (
    <div
      className="w-full pt-[10px] overflow-y-scroll"
      style={{ height: "calc(100% - 62px)" }}
    >
      <div
        onClick={() => onCallStartAudioVideo()}
        className="right"
        style={{
          marginLeft: "auto",
          cursor: "pointer",
          position: "absolute",
          right: "35px",
          top: "-43px",
          zIndex: 99,
        }}
      >
        <Callicon />
      </div>
      <div
        style={{ flexDirection: "column", height: "100%" }}
        className="flex h-[89vh] video"
      >
        {messages && (
          <>
            {messages?.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            <span ref={spanRef} onLoad={scrollToBottom()}></span>
          </>
        )}
        <SendMessage
          selectedChat={selectedChat}
          userFCMTOken={userFCMTOken}
          spanRef={spanRef}
        />
      </div>
      <Modal
        style={customStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <div
          className="your-modal-class"
          style={{
            width: "20%",
            borderRadius: 20,
            padding: 15,
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 17 }}
          >
            Call Type
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <img
              src={image_audio_call_start}
              onClick={() => callAudioVideoApi("Audio")}
              style={{ cursor: "pointer", height: 60, width: 60 }}
            />
            <img
              src={image_video_call}
              onClick={() => callAudioVideoApi("Video")}
              style={{ cursor: "pointer", height: 60, width: 60 }}
            />
          </div>
        </div>
      </Modal>
      {videoCall && (
        <div className="flex  gap-3 pr-2 chat-cont">
          <div className="h-screen md:min-w-[280px] px-2 py-3"></div>
          <VideoCalling
            title={userTitle}
            videoCall={videoCall}
            userImageAudio={userImageAudio}
            userEmailAudio={userEmailAudio}
            userPhoneNumberAudio={userPhoneNumberAudio}
            setVideoCall={setVideoCall}
            callType={callType}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
