import React, { useEffect, useState } from "react";
import AgoraUIKit from "agora-react-uikit";
import "react-toastify/dist/ReactToastify.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase";
import { CallApp_ID, Channel_Name, Channel_TOken, callAppId, videoChannelId, videoToken } from "../../../utils/helper";

const VideoCall = ({ videoCall, setVideoCall, callType }) => {
  const [posts, setPosts] = useState([]); // Initialize with an empty array

  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    const querySnapshot = await getDocs(collection(db, "call"));
    const data = [];

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      data.push(post);
    });

    setPosts(data);
  };

  const rtcProps = {
    // appId: "a8ddcbcbf64a4ee9b13ea7b293e985b6",
    appId: CallApp_ID,
    // appId: callAppId,
    channel:Channel_Name,
    // channel: videoChannelId,
    token:
      Channel_TOken
    // token: "007eJxTYBCeY5a36qv302lHHuk2L8k0c1oaZXjd2vPMxqsfCh8L7JNXYEi0SElJTkpOSjMzSTRJTbVMMjROTTRPMrI0TrW0ME0y2/jdNLUhkJGhvn8ZAyMUgvj8DMGJxaXpiWGZKan5zok5OQwMAHr5Jh8=",
  };

  const callbacks = {
    EndCall: () => setVideoCall(false),
  };

  const rtmProps = {};

  const styleProps = {
    container: {
      height: "80vh",
      display: "grid",
      gridAutoRows: "auto",
      position: "relative",
    },
  };

  return (
    videoCall && (
      <AgoraUIKit
        rtcProps={rtcProps}
        callbacks={callbacks}
        rtmProps={rtmProps}
        styleProps={styleProps}
      />
    )
  );
};

export default VideoCall;
