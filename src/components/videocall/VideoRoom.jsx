import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";

const APP_ID = "a8ddcbcbf64a4ee9b13ea7b293e985b6";
const TOKEN = "007eJxTYBCeY5a36qv302lHHuk2L8k0c1oaZXjd2vPMxqsfCh8L7JNXYEi0SElJTkpOSjMzSTRJTbVMMjROTTRPMrI0TrW0ME0y2/jdNLUhkJGhvn8ZAyMUgvj8DMGJxaXpiWGZKan5zok5OQwMAHr5Jh8=";
const CHANNEL = "SasugaVideoCall";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  useEffect(() => {
    const handleUserJoined = async (user, mediaType) => {
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        setUsers((previousUsers) => [...previousUsers, user]);
      }
      if (mediaType === "audio") {
        // user.audioTrack.play()
      }
    };

    const handleUserLeft = (user) => {
      setUsers((previousUsers) =>
        previousUsers.filter((u) => u.uid !== user.uid)
      );
    };

    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    let tracks; // Declare tracks outside the Promise block

    client.join(APP_ID, CHANNEL, TOKEN, null).then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      ).then(([newTracks, uid]) => {
        tracks = newTracks; // Assign tracks here
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
      });

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.unpublish(tracks).then(() => client.leave());
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 200px)",
        }}
      >
        {users.map((user) => (
          <h1>Hello there</h1>
          // <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};

export default VideoRoom;
