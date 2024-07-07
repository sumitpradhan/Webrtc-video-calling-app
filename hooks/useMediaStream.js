import { useEffect, useRef, useState } from "react"

//This Hook will be used to get user stream using Navigator
export const useMediaStream = () => {
    const [state,setState] = useState(null);
    const isStreamSet =useRef(false);
    useEffect(()=>{
        if (isStreamSet.current) return;
        isStreamSet.current=true;
        (async function initStream(){
            try{
                const stream= await navigator.mediaDevices.getUserMedia({ // Navigator is a web Api to get details from user Agents (browser etc)
                    audio:true,
                    video:true
                })

                console.log("Setting Media stream");
                setState(stream);
            }
            catch(e)
            {
                console.log("error geting user stream.")
            }
        })()
    },[]);

    return {stream: state};
}

export default useMediaStream;