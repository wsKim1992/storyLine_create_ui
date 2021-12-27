import React,{useState,useCallback,useRef} from "react";
import { useEffect } from "react";

const MicAndAudioTest = ()=>{
    const [clicked,setClicked]=useState(false);
    const [audioContext,setAudioContext] = useState(null);
    const [recorder,setRecorder]=useState(null);
    const [message,setMessage]=useState('make sine wave');
    const [chunks,setChunks]=useState([]);
    const [url,setUrl]=useState(null);
    const [source,setSource]=useState(null);
    const audioRef = useRef(null);

    useEffect(()=>{
        
        return ()=>{
            if(audioContext)audioContext.disconnect();
            if(url)window.URL.revokeObjectURL(url);
        }
    },[])

    

    const onClickInsertIntoAudio=useCallback((event)=>{
        if(chunks){
            console.log(chunks);
            let blob = new Blob(chunks,{'type':'audio/ogg; codecs=opus'});
            const tempURL = window.URL.createObjectURL(blob);
            audioRef.current.src=tempURL;
            setUrl(tempURL);
        }
    },[chunks])

    const onClickBtn = useCallback((event)=>{
        if(!clicked){
            if(navigator.mediaDevices){
                navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    const ac = new AudioContext();
                    setAudioContext(ac);
                    /* const t_source = ac.createMediaStreamSource(stream);
                    t_source.connect(ac.destination);
                    setSource(t_source) */;
                    const t_recorder = new MediaRecorder(stream);
                    t_recorder.ondataavailable=(e)=>{
                        setChunks([e.data])
                    }
                    t_recorder.onstop=(e)=>{
                        console.log("stopped!");
                    }
                    t_recorder.start();
                    setRecorder(t_recorder);
                }).catch((err)=>{
                    console.error(err);
                    alert("장비 연결 문제 발생!")
                })
            }
            
            setMessage('stop recording');
        }else{
            recorder.stop();
            setMessage('make sine wave')
        }
        setClicked(prevVal=>!prevVal);
    },[recorder,clicked])

    return (
        <React.Fragment>
            <h1>MediaStream Test</h1>
            <p>Encoding a pure sine wave to and Opus file</p>
            <button onClick={onClickBtn}>{message}</button>
            <button onClick={onClickInsertIntoAudio}>오디오에 넣기</button>
            <audio ref={audioRef} controls></audio>
        </React.Fragment>
    )
}

export default MicAndAudioTest