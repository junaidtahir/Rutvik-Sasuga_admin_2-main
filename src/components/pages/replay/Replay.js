import React, { useEffect, useRef } from "react";
import { Search } from "../../../assets/icons";
import Notification from "../../../Notification";
import VideoCalling from "../../../VideoCalling.tsx";
import Calllpopup from "../../layout/callpopup";
import Chat from "./Chat";
import { db, auth, messaging } from "../../../Firebase";
import { useState } from "react";
import { query, collection, onSnapshot, setDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { onMessage } from "firebase/messaging";
import { useLocation } from "react-router-dom";
import phoneIcon from "../../../assets/images/phone-icon.png";
import messageIcon from "../../../assets/images/message-icon.png";
import userProfile from "../../../assets/images/user-profile.png";
import moment from "moment";
import CallDuration from "./CallDuration.js";
const Replay = () => {
  const [user] = useAuthState(auth);
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [filteredData, setfilteredData] = useState([]);
  const [userFCMTOken, setUserFCMToken] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userEmailAudio, setUserEmailAudio] = useState("");
  const [userPhoneNumberAudio, setUserPhoneNumberAudio] = useState("");
  const [userImageAudio, setUserAudioImage] = useState("");
  const [open, setOpen] = useState(null);
  const [videoCall, setVideoCall] = useState(false);
  const [toggleVideo, settoggleVideo] = useState(false);
  const [callType, setCallType] = useState("Audio");
  const [nameUser, setNameUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userImageChatSection, setUserImageChatSection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isReceiving, setIsReceiving] = useState(false);
  

  // const onMessageListener = () => {
  //   return new Promise((resolve) => {
  //     onMessage(messaging, (payload) => {
  //       console.log("payload", payload);
  //       setNameUser(payload.notification.title);
  //       settoggleVideo(true);
  //       setOpen(true);
  //     });
  //   });
  // };

  // useEffect(()=>{
  //   onMessageListener();
  // },[])

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "chatroom/" + user.uid + "/chats"));

      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedChats = [];
        let counter = 0;
        QuerySnapshot.forEach((doc) => {
          fetchedChats.push({ ...doc.data(), id: doc.id });
          // to select first chat by default
          // if (counter == 0) {
          //   setSelectedUser(doc.id);
          // }
          counter++;
        });
        // console.log("fetchedChats[0].name",fetchedChats[0]);
        // setUserFCMToken(fetchedChats[0].fcm_token)
        // setUserTitle(fetchedChats[0].name)
        // setUserPhoneNumberAudio(fetchedChats[0].phone)
        // setUserEmailAudio(fetchedChats[0].email)
        // setUserAudioImage(fetchedChats[0].photoUrl)
        setChats(fetchedChats);
      });
      return () => unsubscribe;
    }
  }, [user]);

  const onMessageListener = () => {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        console.log("payload", payload);

        // setNameUser(payload.notification.title);
        // settoggleVideo(true);
        // setOpen(true);
      });
    });
  };
  const location = useLocation();
  const { state } = location;
  // const [typeAudioVideo , settypeAudioVideo] = useState("Audio")
  useEffect(() => {
    // console.log("state.typeAudioVideo",state.typeAudioVideo);
    if (state !== null) {
      setNameUser(state.name);
      setUserEmail(state.email);
      setUserPhoneNumber(state.phoneNumber);
      setUserImageChatSection(state.image);
      settoggleVideo(state.toggleVideo);
      setOpen(state.open);
    }
    setCallType(state == null ? "Audio" : state.typeAudioVideo);
    // onMessageListener();
  }, [location]);

  // const [ids, setIds] = useState([]);

  useEffect(() => {
    let callId = "hO01sqCg552JEdhQMGae";
    const unsubscribe = onSnapshot(doc(db, "call", callId),async (doc1) => {
      let callData = doc1.data();
      if (callData) {
        if (callData.isReceiving === true) {
          setIsReceiving(true);
        }
        if (callData.isCalling === false) {
          settoggleVideo(false);
          setOpen(false);
        }
        if (callData.isCancelled) {
          await setDoc(doc(db, "call", callId), { isCalling: false, isReceiving: false, isCancelled: false, callType: "" } ,{ merge: true }).then(async (docSnap) => { 
              console.log("Call cancelled.")
              window.location.reload();
          });
        }
      }
    });
    return () => unsubscribe;
  }, []);

  const refreshCounts = async (chatId) => {
    const chatRef = doc(db, "chatroom", user.uid, "chats", chatId);
    await setDoc(
      chatRef,
      { web_call_count: 0, web_message_count: 0 },
      { merge: true }
    ).then(async (docSnap) => {
      console.log("counts reset");
    });
  };
  let changeChat = (evnt) => {
    console.log("evnt.phoneevnt.phoneevnt.phone", evnt.phone);
    setUserFCMToken(evnt.fcm_token);
    setUserTitle(evnt.name);
    setUserPhoneNumberAudio(evnt.phone);
    setUserAudioImage(evnt.photoUrl);
    setUserEmailAudio(evnt.email);
    setSelectedUser(evnt.id);
    refreshCounts(evnt.id);
  };
  console.log("videoddsssss", videoCall);
  console.log("chatschatschatschatschats", open);
  return (
    <div className="flex justify-between gap-3 pr-2 chat-cont">
      <div className="border border-[#E2E2E2] h-screen md:min-w-[280px] px-2 py-3">
        <div>
          <div className="relative mt-2 flex items-center">
            <div className="absolute inset-y-0 -top-1.5 left-1.5 flex py-1.5 pr-1.5 text-gray">
              <Search />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md py-1.5 pl-10 border border-gray focus:outline-none"
            />
          </div>
          <div className="mt-[17px] [&>*:nth-child(1)]:mt-0">
            {chats
              .filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((chat, index) => (
                <div
                  key={chat.id}
                  onClick={() => changeChat(chat)}
                  className="chat-item"
                  id={chat.id}
                >
                  <div
                    className={`relative rounded w-full h-[56px] pl-4 py-1 flex items-center gap-3 rounded-b-none mt-2 ${
                      selectedUser == chat.id ? "bg-gray50" : ""
                    }`}
                  >
                    <div className="h-[48px] w-[48px] rounded-full border border-lightblue overflow-hidden">
                      {chat.photoUrl !== "" ? (
                        <img
                          src={chat.photoUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={userProfile}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="text-darkBlack">
                      <h2 className="font-[700] text-base leading-5">
                        {chat.name},{" "}
                        <span className="font-[400] hidden md:block">
                          {chat.phone ? chat.phone : chat.email}
                        </span>
                      </h2>
                      <p className="hidden md:block">{chat.location}</p>
                    </div>
                    <div className="chat-notification-cont">
                      {chat.web_call_count > 0 && (
                        <span className="alertCounts">
                          <span className="numbers">{chat.web_call_count}</span>
                          <img src={phoneIcon} alt="messages" />
                        </span>
                      )}
                      {chat.web_message_count > 0 && (
                        <span className="alertCounts">
                          <span className="numbers">
                            {chat.web_message_count}
                          </span>
                          <img src={messageIcon} alt="messages" />
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="block h-[1px] borderGradient w-full mt-[4.5px]"></span>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* <Notification/> */}
      {open && (
        <Calllpopup
          title={nameUser}
          userImageChatSection={userImageChatSection}
          toggleVideo={toggleVideo}
          settoggleVideo={settoggleVideo}
          open={open}
          setOpen={setOpen}
          userPhoneNumber={userPhoneNumber}
          userEmail={userEmail}
          setVideoCall={setVideoCall}
          setIsReceiving={setIsReceiving}
        />
      )}
      {videoCall && (
        <>
          <VideoCalling
            userImageAudio={userImageAudio}
            userEmailAudio={userEmailAudio}
            userPhoneNumberAudio={userPhoneNumberAudio}
            title={nameUser}
            videoCall={videoCall}
            setVideoCall={setVideoCall}
            callType={callType}
            isReceivings={isReceiving}
          />
          {/* <CallDuration isReceiving={isReceiving} /> */}
        </>
      )}
      {selectedUser && (
        <Chat
          userImageAudio={userImageAudio}
          userTitle={userTitle}
          userPhoneNumberAudio={userPhoneNumberAudio}
          userEmailAudio={userEmailAudio}
          userFCMTOken={userFCMTOken}
          selectedChat={{ selectedUser }}
        />
      )}
    </div>
  );
};

export default Replay;
