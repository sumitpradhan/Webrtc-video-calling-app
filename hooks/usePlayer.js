import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "@/context/socket";
import { useRouter } from "next/router";
const usePlayer = (myId, roomId, peer) => {
  const [players,setPlayers]=useState([]);
  const socket =useSocket();
  const playerCopy=cloneDeep(players);
  const playerHighlighted = playerCopy[myId];
  delete playerCopy[myId];
  const notHighlighted = playerCopy;
  const router =useRouter();
  
  const handleAudioToggle=() =>{
    setPlayers((prev) => {
      const copy = cloneDeep(prev)
      copy[myId].muted = !copy[myId].muted
      return {...copy}
  })
  console.log("toggling audio");
  socket.emit('user-toggle-audio', myId, roomId);
  }

  const handleVideoToggle=() =>{
      console.log("I toggled my video")
        setPlayers((prev) => {
            const copy = cloneDeep(prev)
            copy[myId].playing = !copy[myId].playing
            return {...copy}
        })
        socket.emit('user-toggle-video', myId, roomId)
  }

    const leaveRoom = () => {
      socket.emit('user-leave', myId, roomId)
      console.log("leaving room", roomId)
      peer?.disconnect();
      router.push('/')
  }
  return {players,setPlayers,playerHighlighted,notHighlighted,handleAudioToggle,handleVideoToggle,leaveRoom};
}

export default usePlayer