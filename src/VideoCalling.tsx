import React, { useEffect, useState } from "react";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";
import muteIcon from "./assets/images/mic.png";
import unmuteIcon from "./assets/images/unmute-mic.png";
import image_defalut_radius from "./assets/images/image_defalut_radius.png";
import image_default_user_white from "./assets/images/image_default_user_white.png";
import muteVideoIcon from "./assets/images/video-icon.png";
import image_audio from "./assets/images/image_audio.png";
import unmuteVideoIcon from "./assets/images/mute-video-icon.png";
import leaveCall from "./assets/images/leave-call.png";
import { auth, db } from "./Firebase";
import {
  query,
  onSnapshot,
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  CallApp_ID,
  Channel_Name,
  Channel_TOken,
  callAppId,
  videoChannelId,
  videoToken,
} from "./utils/helper";
import CallDuration from "./components/pages/replay/CallDuration";
// define config for rtc engine

const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

// const appId: string = "db20be2a64fc430891b0759238f9cd0a"; //ENTER APP ID HERE
const appId: string = CallApp_ID; //ENTER APP ID HERE
// const appId: string = callAppId; //ENTER APP ID HERE
const token: string = Channel_TOken;
// "007eJxTYAiL+jeR+eJR2QQt7QWT40J4fn7eIujb+eQoh5hgzRL2Fg4FhpQkI4OkVKNEM5O0ZBNjAwtLwyQDc1NLI2OLNMvkFINEpgSb1IZARoZrU1cwMTIwMrAAMYjPBCaZwSQLmORm8CrNS8xMCctMSc1nYAAAs2wiRg==";
const chennelName: string = Channel_Name;
// const chennelName: string = videoChannelId;

const Videos = (props: {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}) => {
  const { users, tracks } = props;

  return (
    <div id="videos">
      {/* { tracks[1] && */}
      <AgoraVideoPlayer
        className="vid"
        videoTrack={tracks[1]}
        style={{ height: "530px", width: "100%" }}
      />
      {/* } */}
      {/* { tracks[1] &&<div style={{ height: "530px", width: "100%",display:"flex",justifyContent:"center", alignItems:"center"}}>
      <img src={ic_default_user}  style={{ height: "200px",  }}/>
      </div>} */}
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <AgoraVideoPlayer
                className="small-video vid"
                videoTrack={user.videoTrack}
                key={user.uid}
              />
            );
          } else return null;
        })}
    </div>
  );
};

const VideoCalling = ({
  videoCall,
  setVideoCall,
  callType,
  title,
  userEmailAudio,
  userPhoneNumberAudio,
  userImageAudio,
  isReceivings,
}) => {
  // console.log("dddcallTypecallType",callType);

  const [inCall, setInCall] = useState(true);
  const [channelName, setChannelName] = useState(chennelName);
  const useClient = createClient(config);
  const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
  const { audioTrack, videoTrack } = createMicrophoneAndCameraTracks();
  const [isReceiving, setIsReceiving] = useState(false);
  const [isIncoming, setIsIncoming] = useState(false);

  useEffect(() => {
    if (isReceivings === true) {
      setIsReceiving(true);
    }
  }, [isReceivings]);

  useEffect(() => {
    const q = query(collection(db, "call"));
    const callRefs = doc(db, "call", "hO01sqCg552JEdhQMGae");
    const ids = [];
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      ids.length = 0;
      QuerySnapshot.forEach((doc) => {
        ids.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      if (ids.length !== 0) {
        console.log(
          "🚀 ~ file: VideoCalling.tsx:132 ~ unsubscribe ~ ids:",
          ids
        );
        if (ids[0]?.data.isReceiving === true) {
          setIsReceiving(true);
        } else if (ids[0]?.data.callType === "incoming") {
          setIsIncoming(true);
        }
      }
    });
    return () => unsubscribe;
  }, []);

  useEffect(() => {
    if (isReceivings === true) {
      setIsReceiving(true);
    }
  }, [isReceivings]);

  useEffect(() => {
    const q = query(collection(db, "call"));
     const callRefs = doc(db, "call", "hO01sqCg552JEdhQMGae");
    const ids = [];
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      ids.length = 0;
      QuerySnapshot.forEach((doc) => {
        ids.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      if (ids.length !== 0) {
        console.log("🚀 ~ file: VideoCalling.tsx:132 ~ unsubscribe ~ ids:", ids)
        if (ids[0]?.data.isReceiving === true) {
          setIsReceiving(true);
        }else if (ids[0]?.data.callType === "incoming") {
          setIsIncoming(true);
        }
      }
    });
    return () => unsubscribe;
  }, []);

  const Controls = (props: {
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
    setStart: React.Dispatch<React.SetStateAction<boolean>>;
    setVideoOnOff: React.Dispatch<React.SetStateAction<boolean>>;
    setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const client = useClient();
    const { tracks, setStart, setVideoOnOff, setInCall } = props;
    const [trackState, setTrackState] = useState({ video: true, audio: true });

    const mute = async (type: "audio" | "video") => {
      if (type === "audio") {
        await tracks[0].setEnabled(!trackState.audio);
        setTrackState((ps) => {
          return { ...ps, audio: !ps.audio };
        });
      } else if (type === "video") {
        await tracks[1].setEnabled(!trackState.video);
        setVideoOnOff(!trackState.video);
        setTrackState((ps) => {
          return { ...ps, video: !ps.video };
        });
      }
    };

    const leaveChannel = async () => {
      await client.leave();
      client.removeAllListeners();
      tracks[0].close();
      tracks[1].close();
      setStart(false);
      const callRef = doc(db, "call", "hO01sqCg552JEdhQMGae");
      await setDoc(
        callRef,
        { isCalling: false, isReceiving: false, isCancelled: false, callType: "" },
        { merge: true }
      ).then(async (docSnap) => {
        window.location.reload();
        console.log("Video Call done start");
      });
      setVideoCall(false);
      setInCall(false);
    };

    return (
      <div className="controls">
        <p
          className={trackState.audio ? "on" : ""}
          onClick={() => mute("audio")}
        >
          {trackState.audio ? (
            <img src={muteIcon} alt="mute icon" />
          ) : (
            <img src={unmuteIcon} alt="unmute icon" />
          )}
        </p>
        {callType == "Video" && (
          <p
            className={trackState.video ? "on" : ""}
            onClick={() => mute("video")}
          >
            {trackState.video ? (
              <img src={muteVideoIcon} alt="mute video icon" />
            ) : (
              <img src={unmuteVideoIcon} alt="unmute video icon" />
            )}
          </p>
        )}
        {
          <p onClick={() => leaveChannel()}>
            <img src={leaveCall} alt="leave icon" />
          </p>
        }
      </div>
    );
  };

  const VideoCall = (props: {
    setInCall: React.Dispatch<React.SetStateAction<boolean>>;
    channelName: string;
  }) => {
    const { setInCall, channelName } = props;
    const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const [start, setStart] = useState<boolean>(false);
    const [videoAutoEnd, setVideoAutoEnd] = useState<boolean>(false);
    const [videoOnOff, setVideoOnOff] = useState<boolean>(true);
    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();

    useEffect(() => {
      // function to initialise the SDK
      let init = async (name: string) => {
        console.log("init", name);
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          console.log("subscribe success");
          if (mediaType === "video") {
            setUsers((prevUsers) => {
              return [...prevUsers, user];
            });
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });

        client.on("user-unpublished", (user, type) => {
          console.log("unpublished", user, type);
          if (type === "audio") {
            user.audioTrack?.stop();
          }
          if (type === "video") {
            setUsers((prevUsers) => {
              return prevUsers.filter((User) => User.uid !== user.uid);
            });
          }
        });

        client.on("user-left", (user) => {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
          setVideoCall(false);
          setInCall(false);
        });

        const joined = await client.join(appId, name, token, null);

        if (tracks) await client.publish([tracks[0], tracks[1]]);
        setStart(true);
      };

      if (ready && tracks) {
        console.log("init ready");
        init(channelName);
      }
    }, [channelName, client, ready, tracks]);

    useEffect(() => {
      setTimeout(() => {
        setVideoAutoEnd(true);
      }, 60000);
    }, []);

    useEffect(() => {
      if (users.length === 0 && videoAutoEnd) {
        leaveChannel();
      }
    }, [users, videoAutoEnd]);

    const leaveChannel = async () => {
      await client.leave();
      client.removeAllListeners();
      tracks && tracks[0].close();
      tracks && tracks[1].close();
      setStart(false);
      const callRef = doc(db, "call", "hO01sqCg552JEdhQMGae");
      await setDoc(
        callRef,
        { isCalling: false, isReceiving: false, isCancelled: false, callType: "" },
        { merge: true }
      ).then(async (docSnap) => {
        window.location.reload();
        console.log("Video Call done start");
      });
      setVideoCall(false);
      setInCall(false);
    };

    return (
      <div className="call-cont">
        {isReceiving && <CallDuration isIncoming={isIncoming} />}

        {callType == "Video" && start && tracks && videoOnOff && (
          <Videos users={users} tracks={tracks} />
        )}

        {callType == "Video" && start && tracks && !videoOnOff && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={image_defalut_radius}
              style={{
                height: "200px",
                width: "200px",
                objectFit: "cover",
                borderRadius: "100px",
              }}
            />
          </div>
        )}
        {callType == "Audio" && (
          <div>
            <img
              src={userImageAudio == "" ? image_defalut_radius : userImageAudio}
              style={{
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 100,
              }}
            />
            <div
              style={{
                color: "#fff",
                fontSize: 20,
                display: "flex",
                fontWeight: "bold",
                marginBottom: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              {title + " ..."}
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: 20,
                display: "flex",
                fontWeight: "bold",
                marginBottom: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              {userPhoneNumberAudio ?? userEmailAudio}
            </div>
          </div>
        )}
        {ready && tracks && (
          <Controls
            setVideoOnOff={setVideoOnOff}
            tracks={tracks}
            setStart={setStart}
            setInCall={setInCall}
          />
        )}
      </div>
    );
  };

  const ChannelForm = (props: {
    setInCall: React.Dispatch<React.SetStateAction<boolean>>;
    setChannelName: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const { setInCall, setChannelName } = props;
    setChannelName(chennelName);
    return (
      <form className="join">
        <button
          onClick={(e) => {
            e.preventDefault();
            setInCall(true);
            setVideoCall(true);
          }}
        >
          Join
        </button>
      </form>
    );
  };
  return (
    <>
      <VideoCall setInCall={setInCall} channelName={channelName} />
    </>
  );
};
export default VideoCalling;
