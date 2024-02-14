import React, { useState, useEffect } from "react";
import AgoraUIKit from "agora-react-uikit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { auth, db } from "../../Firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { CallApp_ID, Channel_Name, Channel_TOken, callAppId, videoChannelId, videoToken } from "../../utils/helper";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";

const config = {
  mode: "rtc",
  codec: "vp8",
};
const AgoraUI = ({ videoCall, setVideoCall, callType }) => {
  const [hasCamera, setHasCamera] = useState(false);
  const useClient = createClient(config);
  const client = useClient();
  const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

  const { ready, tracks } = useMicrophoneAndCameraTracks();

  // useEffect(() => {
  //   setVideoCall(videoCalls)
  // }, [videoCalls])

  useEffect(() => {
    checkCameraAvailability();
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCamera(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      setHasCamera(false);
      console.error("Error accessing camera:", error);
    }
  };
  // const videoProps = {
  //   appId: "bd51d526750c4476a2a041b555ab91c2",
  //   channel: "SasugaVideoCalling",
  //   token: "007eJxTYNixe+EJ7tw9Uedm5P9mSSvKV72bveONI/vd8JPPxO9ULzuswJCUYmqYYmpkZm5qkGxiYm6WaJRoYGKYZGpqmphkaZhstKHCPLUhkJHBPk6emZEBAkF8IYbgxOLS9MSwzJTUfOfEnJzMvHQGBgC0LCV4",
  //   mode: "live",
  //   codec:  null,
  // };
  const videoProps = {
    // appId: "db20be2a64fc430891b0759238f9cd0a",
    appId: CallApp_ID,
    // appId: callAppId,
    channel:Channel_Name,
    // channel: videoChannelId,
    token:
      Channel_TOken,
    // token:
    //   "007eJxTYDikL3Gx3+9e8RGzqvMKipHirttDSl68mDf/7I0cGY9FbLsUGFKSjAySUo0SzUzSkk2MDSwsDZMMzE0tjYwt0iyTUwwS/8y0Sm0IZGQ4w3mWhZGBkYEFiEF8JjDJDCZZwCQ3g1dpXmJmSlhmSmo+AwMAosMk/w==",
    mode: "live",
    codec: null,
  };
  const audioProps = {
    appid: "bd51d526750c4476a2a041b555ab91c2",
    channel: "SasugaAudioCalling",
    uid: "0",
    token:
      "007eJxTYBD9rSO4M63qB/PNwlUvUmNiQlK1Irp/rd7woaf4ybfj8WoKDEkppoYppkZm5qYGySYm5maJRokGJoZJpqamiUmWhslGLhXmqQ2BjAwCcx4wMjJAIIgvxBCcWFyanuhYmpKZ75yYk5OZl87AAAB4WSVH",
    mode: "rtc",
    codec: "vp8",
  };
  function showMessage(text) {
    document.getElementById("message").textContent = text;
  }

  // startBasicCall();
  const callbacks = {
    EndCall: async () => {


      await client.leave();
      client.removeAllListeners();
      tracks[0].close();
      tracks[1].close();

      const callRef = doc(db, "call", "hO01sqCg552JEdhQMGae");
      await setDoc(
        callRef,
        { isCalling: false, isReceiving: false ,callType: "" },
        { merge: true }
      ).then(async (docSnap) => {
        console.log("call backdone start");
      });
      setVideoCall(false);
    },
  };

  const rtmProps = {};
  const styleProps = {};

  return videoCall ? (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        gridAutoRows: "auto",
        position: "relative",
      }}
    >
      <AgoraUIKit
        rtcProps={videoProps}
        callbacks={callbacks}
        rtmProps={rtmProps}
        styleProps={styleProps}
      />
      {videoCall}
      <ToastContainer />
      {callType}
    </div>
  ) : (
    <div>
      {/* {hasCamera ? (
        <button
          className="text-white bg-black hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-black dark:focus:ring-blue-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          onClick={() => setVideoCall(true)}
        >
          Start Call
        </button>
      ) : (
        <p className="text-white bg-black hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-black dark:focus:ring-blue-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          No camera found or camera access is denied.
        </p>
      )} */}
    </div>
  );
};

export default AgoraUI;
