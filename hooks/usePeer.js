import { useSocket } from "@/context/socket";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const usePeer =()=>{
    const [peer,setPeer]=useState(null);
    const [myId,setMyId] =useState('');
    const isPeerSet=useRef(false)
    const socket =useSocket();
    const roomId=useRouter().query.roomId;

    useEffect(()=>{
        if(isPeerSet.current||!roomId||!socket) return;
        isPeerSet.current=true;
        (async function initPeer(){
            const myPeer = new (await import('peerjs')).default()//Since Next renders everything on server side(can't use web api like window, navigator) we can't import peer js normally , so using this way
            setPeer(myPeer)//created new peer connection

            myPeer.on('open',(id)=>{ // got id of our peer
                console.log("user ID =",id)
                setMyId(id);
                socket?.emit("joined-room",roomId,id)//sending room id and peerid to socket server
            })
        })()
    },[roomId,socket]);

    return {
        peer,
        myId
    }
}

export default usePeer;