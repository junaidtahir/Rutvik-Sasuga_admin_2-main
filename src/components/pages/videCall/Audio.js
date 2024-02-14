import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const Audio = () => {
    const [localTracks, setLocalTracks] = useState({ audioTrack: null });
    const [remoteUsers, setRemoteUsers] = useState({});
    const [options, setOptions] = useState({
        appid: "1887d2c641924eec983460147d6e9c97",
        channel: "JunaidAudio",
        uid: 0,
        token: "007eJxTYDApOey0Zo8b12/ra7unp3fLcdVVXdlRLF0ayCf3o9rVaKcCg6GFhXmKUbKZiaGlkUlqarKlhbGJmYGhiXmKWaplsqV5+y2b1IZARoam/mxGRgYIBPG5GbxK8xIzUxxLUzLzGRgAujEgYQ==",
    });
    const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8',
    });

    AgoraRTC.onAutoplayFailed = () => {
        alert('Click to start autoplay!');
    };

    AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
        if (changedDevice.state === 'ACTIVE') {
            localTracks.audioTrack.setDevice(changedDevice.device.deviceId);
        } else if (changedDevice.device.label === localTracks.audioTrack.getTrackLabel()) {
            const oldMicrophones = await AgoraRTC.getMicrophones();
            oldMicrophones[0] && localTracks.audioTrack.setDevice(oldMicrophones[0].deviceId);
        }
    };

    const handleUserPublished = (user, mediaType) => {
        const id = user.uid;
        setRemoteUsers((prevUsers) => ({ ...prevUsers, [id]: user }));
        subscribe(user, mediaType);
    };

    const handleUserUnpublished = (user, mediaType) => {
        // if (mediaType === 'audio') {
            const id = user.uid;
            const newRemoteUsers = { ...remoteUsers };
            delete newRemoteUsers[id];
            setRemoteUsers(newRemoteUsers);
        // }
    };

    const subscribe = async (user, mediaType) => {
        const uid = user.uid;
        await client.subscribe(user, mediaType);
        // if (mediaType === 'audio') {
            user.audioTrack.play();
        // }
    };

    const join = async () => {
        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);

        const [uid, audioTrack] = await Promise.all([
            client.join(options.appid, options.channel, options.token || null, options.uid || null),
            AgoraRTC.createMicrophoneAudioTrack({ encoderConfig: 'music_standard' }),
        ]);

        setOptions((prevOptions) => ({ ...prevOptions, uid }));
        setLocalTracks({ audioTrack });

        await client.publish(Object.values(localTracks));
    };

    const leave = async () => {
        for (const trackName in localTracks) {
            const track = localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
            }
        }

        setRemoteUsers({});
        setLocalTracks({ audioTrack: null });

        await client.leave();
        setOptions((prevOptions) => ({ ...prevOptions, uid: null }));
    };
    if (options.appid && options.channel) {
        // debugger

        join();
        
    }
    // useEffect(() => {
        
    //     return () => {
    //         // Cleanup when component unmounts
    //         // leave();
    //     };
    // }, [options, localTracks]);

    

    return (
        <div>
            {/* <button id="leave" onClick={leave} disabled={!localTracks.audioTrack}> */}
            <button onClick={leave} id="leave"  disabled={!localTracks.audioTrack}>
                Leave
            </button>
            <div id="message"></div>
        </div>
    );
};

export default Audio;
