import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Calllpopup from "./components/layout/callpopup";
import AgoraUI from "./components/videocall/videocall";
import Audio from "./components/pages/videCall/Audio";
import { db, messaging } from "./Firebase";
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { onMessageListener } from "./Firebase";
import { onMessage } from "firebase/messaging";
import VideoCalling from "./VideoCalling.tsx";
import { useNavigate } from "react-router-dom";
const Notification = () => {
  const [call, setCall] = useState(false);

  const [open, setOpen] = useState(null);
  const [videoCall, setVideoCall] = useState(false);
  const [toggleVideo, settoggleVideo] = useState(false);
  const [callType, setCallType] = useState("Audio");
  const [nameUser, setNameUser] = useState("");
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ title: "", body: "" });
  const onMessageListener = () => {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        if (payload.from !== "") {
          console.log("payload", payload);
          const messageData = {
            name: payload.notification.title,
            toggleVideo: true,
            image: payload.notification.image,
            open: true,
            email: payload.data["gcm.notification.email"],
            phoneNumber: payload.data["gcm.notification.mobile_number"],
            typeAudioVideo: payload.notification.body,
          };
          navigate("/reply", { state: messageData });
        }
        // setNameUser(payload.notification.title);
        // settoggleVideo(true);
        // setOpen(true);
      });
    });
  };

  useEffect(() => {
    onMessageListener();
    // let callId = 'rXEv8ExkXT5NdAllA7to';
    // const q = query(collection(db, "call/"));
    // const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
    //   QuerySnapshot.forEach((doc) => {
    //     const data = doc.data();
    //     const isCalling = data.isCalling;
    //     const isReceiving = data.isReceiving;
    //     if (isCalling) {
    //       setCallType(data.callType)
    //       settoggleVideo(true)
    //       setOpen(true)
    //     }
    //     else{
    //       settoggleVideo(false)
    //       setVideoCall(false)
    //       setOpen(false)
    //     }
    //   });
    // });
    // return () => unsubscribe;
  }, []);

  useEffect(() => {
    if (open === false) {
      checkCameraAvailability();
      // setVideoCall(true)
    }
  }, [open]);

  const checkCameraAvailability = async () => {
    if (callType !== "Audio") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
  };
  console.log("videoCallvideoCall", videoCall);
  console.log("callTypecallType", callType);
  return (
    <>
      {toggleVideo && (
        <div className="w-[600px]">
          {open && (
            <Calllpopup
              title={nameUser}
              toggleVideo={toggleVideo}
              settoggleVideo={settoggleVideo}
              open={open}
              setOpen={setOpen}
              setVideoCall={setVideoCall}
            />
          )}
          {/* {callType === 'Audio' ? <Audio/> : */}
          {/* {videoCall && (
            <AgoraUI
              videoCall={videoCall}
              setVideoCall={setVideoCall}
              callType={callType}
            />
          )} */}
          {videoCall && (
            <VideoCalling
              videoCall={videoCall}
              setVideoCall={setVideoCall}
              callType={callType}
            />
          )}
          {/* } */}
        </div>
      )}
    </>
  );
};

export default Notification;
