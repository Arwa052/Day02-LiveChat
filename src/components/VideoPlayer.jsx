import React, { useEffect, useRef } from 'react'

const VideoPlayer = ({user}) => {
    const ref = useRef()

    useEffect(()=>{
        user.videoTrack.play(ref.current)
    },[])

    return (
        <div>
            Person Uid: {user.uid}
            <div ref={ref} style={{width: '400px', height: '450px'}}></div>
        </div>
    )
}

export default VideoPlayer
