'use client'
import { Mic,MicOff,PhoneOff,Video,VideoOff } from "lucide-react";

const BottomTools=({muted,playing,handleAudioToggle,handleVideoToggle,leaveRoom})=>{

    return(
        <div className="absolute w-[300px] flex gap-2 bottom-5 left-0 right-0 mx-auto">
            {!muted?<Mic 
            className=" rounded-full cursor-pointer "
            onClick={handleAudioToggle}/>:<MicOff 
            className=" bg-red-400 rounded-full cursor-pointer"
            onClick={handleAudioToggle}/>}
            {playing?<Video  className=" rounded-full cursor-pointer" 
            onClick={handleVideoToggle}/>:<VideoOff 
            className=" bg-red-400 rounded-full cursor-pointer"
            onClick={handleVideoToggle}/>}

            <PhoneOff   className=" bg-red-400 rounded-full cursor-pointer" onClick={leaveRoom}/>
        </div>
    );
}

export default  BottomTools;
