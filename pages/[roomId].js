'use client'
import BottomTools from "@/components/BottomTools";
import CopySection from "@/components/CopySection";
import Player from "@/components/Player";
import { useSocket } from "@/context/socket"
import useMediaStream from "@/hooks/useMediaStream";
import usePeer from "@/hooks/usePeer";
import usePlayer from "@/hooks/usePlayer";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import { useState ,useEffect} from "react";

const Room= ()=>{
  const [hasWindow, setHasWindow] = useState(false);
  const socket =useSocket();
  const { peer, myId}=usePeer();
  const {stream} =useMediaStream();
  const roomId=useRouter().query.roomId;
  const {players,setPlayers,playerHighlighted,notHighlighted,handleAudioToggle,handleVideoToggle,leaveRoom}=usePlayer(myId,roomId,peer);
  const [users, setUsers] = useState([])

  //To check if it is rendered on server or client, server doesn't have windpw object
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);
  
  //Listens for event when someone joins room and later send stream to them, call them.
  useEffect(()=>{
    if(!socket ||!peer||!stream) return;

    const handleUserConnected =(newUser)=>{
        console.log(`user-id ${newUser} connected in room`)
        //Calling the peer and sending the stream
        const call = peer.call(newUser,stream)
        call.on('stream',(incomingStream)=>{
          setPlayers((prev)=>({
            ...prev,
            [newUser]:{
              url:incomingStream,
              muted:false,
              playing:true
            }
          }))

          setUsers((prev) => ({
            ...prev,
            [newUser]: call
          }))
        })//accessing the incoming stream from other user
        
      }


    socket?.on('user-connected',handleUserConnected)
    return ()=>{
      socket?.off('user-connected',handleUserConnected)
    }
  },[socket,peer,stream])

  //For recieving calls
  useEffect(()=>{
    if(!peer||!stream) return;
    peer.on('call',(call)=>{
      const{peer:callerId}=call;//getting caller id aka Peer Id
      console.log(`user-id ${callerId} calling`)
      call.answer(stream);//Sendind current stream
      call.on('stream',(incomingStream)=>{
        setPlayers((prev)=>({
          ...prev,
          [callerId]:{
            url:incomingStream,
            muted:false,
            playing:true
          }
        }))
      })//accessing the incoming stream from other user
    })
  },[peer,stream]);

  //Setting inital stream , current user stream
  useEffect(()=>{
    if(!stream||!myId) return;
    
    setPlayers((prev)=>({
      ...prev,
      [myId]:{
        url:stream,
        muted:true,
        playing:true
      }
    }))

  },[myId,stream,setPlayers])

  //Listens if some user toggled audio,video or left room
  useEffect(() => {
    if (!socket) return;
    const handleToggleAudio = (userId) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close()
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    }

    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleUserLeave);
    return () => {
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-leave", handleUserLeave);
    };
  }, [players, setPlayers, socket,users]);

  

    return(<>
        <div className="absolute w-9/12 left-0 right-0 mx-auto top-[20px] bottom-[50px] h-[calc((100vh-20px-100px)]">
          {
            hasWindow && 
            playerHighlighted && 
            <Player 
            url={playerHighlighted?.url} 
            muted={playerHighlighted?.muted}  
            isActive 
            playing={playerHighlighted?.playing}
            />
          }
        </div>
        <div className="absolute flex flex-col overflow-y-auto w-[200px] h-[calc(100vh-20px)] top-[20px] right-[20px]">
            { 
             hasWindow && Object.keys(notHighlighted)?.map((playerId)=>{
              const {url,muted,playing}=players[playerId];
              return <Player url={url} key={playerId} muted={muted} playing={playing} isActive={false}/>
            })
            
            }
        </div>
        
          
        <BottomTools  
            muted={playerHighlighted?.muted}  
            playing={playerHighlighted?.playing}
            handleAudioToggle={handleAudioToggle}
            handleVideoToggle={handleVideoToggle}
            leaveRoom={leaveRoom}/>

        <CopySection roomId={roomId}/>
    </>)
}

export default Room;