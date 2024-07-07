import { Server } from "socket.io";

const SocketHandler=(req,resp)=>{
    //Checks if the socket(client) has existing connection, we dont want to make new servers everytime API is called. 
    if(resp.socket.server.io)
    {
        console.log("Socket already running");
    }
    else//create new socket server and set response
    {
        const io =new Server(resp.socket.server);
        resp.socket.server.io=io;
        io.on('connection',(socket)=>{
            console.log('server is connected!!!') 

            //user joined a rooom
            socket.on('joined-room',(roomId,userId)=>{
                socket.join(roomId)
                //Broadcasting it's peer Id to other people in the room.
                socket.broadcast.to(roomId).emit('user-connected',userId)
            })

            socket.on('user-toggle-audio',(userId, roomId)=>{
                console.log('server audio toggled!!!') 
                socket.join(roomId)
                //Broadcasting it'sthat user toggled audio in to people in room.
                socket.broadcast.to(roomId).emit('user-toggle-audio',userId)
            })
            socket.on('user-toggle-video',(userId, roomId)=>{
                socket.join(roomId)
                //Broadcasting it'sthat user toggled audio in to people in room.
                socket.broadcast.to(roomId).emit('user-toggle-video',userId)
            })

            socket.on('user-leave',(userId, roomId)=>{
                socket.join(roomId)
                //Broadcasting it'sthat user leaving people in room.
                socket.broadcast.to(roomId).emit('user-leave',userId)
            })

        })
    }
    resp.end();
}

export default SocketHandler;