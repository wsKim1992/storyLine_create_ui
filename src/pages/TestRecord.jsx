import React, { useState,useRef,useEffect,useCallback } from "react";
import { useSpeechRecognition } from "react-speech-kit";
const base64ToBlob = (base64Data,contentType)=>{
    let sliceSize = 1024;
    let byteCharacters = atob(base64Data);
    let bytesLength = byteCharacters.length;
    let slicesCount = Math.ceil(bytesLength/sliceSize);
    let byteArrays = new Array(slicesCount);
    for(let sliceIndex= 0 ;sliceIndex<slicesCount;++sliceIndex){
        let begin = sliceIndex*sliceSize;
        let end = Math.min(begin+sliceSize,bytesLength);
        let bytes = new Array(end-begin);
        for(let offset=begin,i=0;offset<end;++i,++offset){
            bytes[i]=byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex]= new Uint8Array(bytes);
    }
    return new Blob(byteArrays,{type:contentType})
}

const AudioRecord = ()=>{
    
    const audioRef = useRef(null);
    const [audioFileURL,setAudioFileURL]=useState(null);
    const [audioContext,setAudioContext]=useState(null);
    const [audioSource,setAudioSource]=useState(null);
    const [isMp3,setIsMp3]=useState(false);
    const [recorder,setRecorder]=useState(null);
    const [onRec, setOnRec] = useState(true);
    const [message,setMessage]=useState('');
    const {stop,listen,listening} = useSpeechRecognition({
        onResult:result=>{
            console.log(result);
            setMessage(result);
        }
    })
    useEffect(()=>{
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        setAudioContext(new AudioContext());

        return()=>{
            window.URL.revokeObjectURL(url);
            setAudioFileURL(null);
            audioContext.close();
            setAudioContext(null);
        }
    },[])

    const onChangeInput=(evt)=>{
        let file = evt.target.files[0];
        if(file){
            console.log(file.type.match('audio/*'));
            const fileReader = new FileReader();
            fileReader.onload = (event)=>{
                console.log(event.target.result);
                const contentType = event.target.result.split(";")[0].split(":")[1];
                const base64Data = event.target.result.split(",")[1];
               
                const blob= base64ToBlob(base64Data,contentType);

                const url = window.URL.createObjectURL(blob);
                console.log(url);
                audioRef.current.src= url;
                setAudioFileURL(url);
                //window.URL.revokeObjectURL(url);
            }
            fileReader.readAsDataURL(file);
        }
    }

    useEffect(()=>{
        if(audioContext){
            const audioElement = audioRef.current;
            const track = audioContext.createMediaElementSource(audioElement);
            track.connect(audioContext.destination);
            setAudioSource(track);
        }
    },[audioContext])

    const onClickPlay = useCallback((e)=>{
        
        if(audioFileURL&&audioRef.current){
            console.log(audioContext.state);
            if(audioContext.state==='suspended')audioContext.resume();
            else{audioRef.current.play();listen({lang:'ko-KR',continuous:true,interimResults:true})}
        }else{
            alert("음원을 업로드해 주세요!!");
        }
    },[audioFileURL,audioRef.current,audioContext])

    const onClickPause = useCallback(()=>{
        if(audioFileURL&&audioRef.current&&audioContext){
            console.log(audioContext.state);
            if(audioContext.state==='running'){
                audioRef.current.pause();
                audioContext.suspend();
                stop();
            }
            else return false;
        }else{
            alert("음원을 업로드해 주세요!!");
        }
    },[audioFileURL,audioRef.current,audioContext])

    const onClickStop = useCallback(()=>{
        if(!audioContext||!audioRef.current||!audioFileURL){
            alert("음원을 업로드해 주세요!");
        }
        if(audioContext.state!=='closed'){
            audioRef.current.pause();
            audioRef.current.currentTime=0;
        }else {
            alert("음원을 업로드해 주세요!!");
        }
    },[audioContext,audioRef.current,audioFileURL])

    const onClickConvertToMic =useCallback( (e)=>{
        if(!audioContext||!audioSource){
            alert("음원을 업로드해 주세요!");
        }
        
        if(!isMp3){
            audioRef.current.load();
            audioSource.disconnect();
            if(!audioSource)setAudioSource(null);
            navigator.mediaDevices.getUserMedia({audio:true})
            .then(stream=>{
                setIsMp3(prevVal=>!prevVal);
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(audioContext.destination);
                setAudioSource(source);
                listen({interimResults:true,lang:'ko-KR',continuous:true});
            })
            .catch(err=>{
                console.error(err);
                alert("getUserMedia is not supported on your browser or no microphone detected")
                return false;
            })
        }else{
            audioSource.disconnect();
            return false;
        }
    },[isMp3,audioContext,audioRef.current,audioFileURL,audioSource,recorder])

    const onClickStopRecording = useCallback((e)=>{
        stop();
        audioSource.disconnect();
        audioContext.close();
    },[])

    return (
        <>
            {!isMp3&&<div>
                <button onClick={onClickPlay}>play</button>
                <button onClick={onClickPause}>pause</button>
                <button onClick={onClickStop}>stop</button>
            </div>}
            <div>
                <audio ref={audioRef} controls>
                </audio>
            </div>
            <div>
                <input onChange={onChangeInput} type="file" id="mp3File" accept="audio"/>
                <label htmlFor="mp3File">파일 업로드</label>
            </div>
            <div>
                <button onClick={onClickConvertToMic}>start recording</button>
                <button onClick={onClickStopRecording}>stop recording</button>
            </div>
            <div style={{backgroundColor:'#fff',width:'100px',height:'30px'}}>{message}</div>

        </>
    )
}

export default AudioRecord;