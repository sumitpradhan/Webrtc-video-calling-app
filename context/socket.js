import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext=createContext(null);

export const useSocket =()=>{
    const socket = useContext(SocketContext);
    return socket;
}

const SocketProvider=(props)=>{
    const {children}=props;
    const [socket,setSocket]=useState(null);

    //when the app is mounted get the socket connection
    useEffect(()=>{
        const connection =io();
        console.log(connection);
        setSocket(connection);
        
    },[]);

    socket?.on('connect_error',async (err)=>{
        console.log("here");
        console.log('Error establishing socket!!!',err);
        await fetch('/api/socket');
    })
    
    return(<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>)
}

export default SocketProvider;