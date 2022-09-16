import React, { useEffect, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import VideoPlayer from './VideoPlayer';

// APP_ID & Token & Channel Name
const APP_ID = '6016f221d3d34be2bd2381d1a3206ffa';
const TOKEN = '007eJxTYOBUVvRITZ/C7vOs/U+t2o6VEydXJC/8tvls6tp/EtPbAg4pMJibmicmmxgmGZkmG5mkmhtYmBmmJhqaJZmnAWWMDM12nFVJtpBXSzb/E8jMyACBID47Q3F2Zk5OZh4DAwClhyDo'
const CHANNEL = 'skillin';

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8'
})

export const VideoRoom = () => {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);

    const handlerUserJoined = async (user,mediaType) => {
        await client.subscribe(user,mediaType);

        if(mediaType === 'video') {
            // setLocalTracks(tracks);
            setUsers((previouseUsers) => [...previouseUsers, user]);
        }

        if( mediaType == 'audio') {
            user.audioTrack.play()
        }
    }

    const handlerUserLeft = (user) => {
        setUsers((previouseUsers) => {
            previouseUsers.filter((u) => u.uid !== user.uid)
        })
    }

    useEffect(()=>{
        client.on('user-published', handlerUserJoined);
        client.on('user-left', handlerUserLeft);

        client.join(APP_ID, CHANNEL, TOKEN, null)
        .then((uid)=>
            Promise.all([ AgoraRTC.createMicrophoneAndCameraTracks(), uid])           
        ).then(([tracks, uid])=>{
            const [audioTrack, videoTrack] = tracks;
            setLocalTracks(tracks);
            setUsers((previouseUsers) => [
                ...previouseUsers,{uid, videoTrack, audioTrack}
            ])
            client.publish(tracks)
        })
        
        return () => {
            for(let localTrack of localTracks){
                localTrack.stop();
                localTrack.close();
            }
            client.off('user-published', handlerUserJoined);
            client.off('user-left', handlerUserLeft);
            client.unpublish(tracks).then(()=> client.leave())
        }
    },[])

    return (
        <div>
            <div>
                Video Room
                <div style={{display: 'grid',gridGap: '15px', gridTemplateColumns: 'repeat(2, 400px)'}}>
                    {users.map((user)=>(
                        <VideoPlayer key={user.uid} user={user} />
                    ))}
                </div>            
            </div>

        </div>
        
    )
}

