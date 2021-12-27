import React,{useRef,useState,useCallback} from 'react';
import { useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';

function Example(){
    const [audioContext,setAudioContext]=useState(null);
    const [audioSource,setAudioSource]=useState(null);
    const [isVoiceRecorded,setIsVoiceRecorded]=useState(null);
    const [analyser,setAnalyser]=useState(null);
    const [url,setUrl]=useState(null);
    const [animationFrame,setAnimationFrame]=useState(null);
    const audioRef = useRef(null);
    const canvasRef= useRef(null);
    const [message,setMessage]=useState('message');
    const {listen,stop}=useSpeechRecognition({
        onResult:(result)=>{
            setMessage(result);
        }
    })
    useEffect(()=>{
        const AudioContext = window.AudioContext||window.webkitAudioContext;
        setAudioContext(new AudioContext());

        return()=>{
            if(analyser)analyser.disconnect();
            if(audioSource)audioSource.disconnect();
            if(audioContext)audioContext.close();
            if(animationFrame)window.cancelAnimationFrame(animationFrame);
            if(URL)window.URL.revokeObjectURL(url);
        }
    },[])
    
    const onClickRecordStart = useCallback(()=>{
        if(!audioContext||!audioRef.current||!canvasRef.current){return false;}
        if(navigator.mediaDevices){
            console.log('getUserMedia supported!');
            navigator.mediaDevices.getUserMedia({audio:true})
            .then(stream=>{
                setIsVoiceRecorded(true);
                const tesmpSource = audioContext.createMediaStreamSource(stream);
                const tempAnalyser = audioContext.createAnalyser();
                //analyser 세팅
                /* tempAnalyser.fftSize=256;
                const bufferLength = tempAnalyser.frequencyBinCount;
                console.log(bufferLength);
                const dataArr = new Uint8Array(bufferLength);
                canvasRef.current.getContext('2d').clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
                tempAnalyser.getByteTimeDomainData(dataArr); */
                
                /* function draw(){
                    tempAnalyser.getByteTimeDomainData(dataArr);
                    canvasRef.current.getContext('2d').fillStyle="rgb(200,200,200)";
                    canvasRef.current.getContext('2d').fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
                    canvasRef.current.getContext('2d').lineWidth=2;
                    canvasRef.current.getContext('2d').strokeStyle="rgb(0,0,0)";
                    canvasRef.current.getContext('2d').beginPath();
                    let sliceWidth = canvasRef.current.width*1.0/bufferLength;
                    let x = 0; 

                    for(let i =0;i<bufferLength;i++){
                        let v = dataArr[i]/128.0;
                        let y = v*canvasRef.current.height/2;
                        if(i==0){
                            canvasRef.current.getContext('2d').moveTo(x,y);
                        }else{
                            canvasRef.current.getContext('2d').lineTo(x,y);
                        }   
                        x+=sliceWidth;
                    }
                    canvasRef.current.getContext('2d').lineTo(canvasRef.current.width,canvasRef.current.height/2);
                    canvasRef.current.getContext('2d').stroke();
                }
                setAnimationFrame(window.requestAnimationFrame(draw));
                draw(); */
                //analyser 세팅완료
                //tesmpSource.connect(tempAnalyser);
                /* tempAnalyser.connect(audioContext.destination);
                setAnalyser(tempAnalyser);
                setAudioSource(tesmpSource) */;
                tesmpSource.connect(audioContext.destination);
                listen({interimResults:false,lang:'ko-KR',continuous:true})
            }).catch(err=>{
                console.error(err);
                alert("마이크 연결이 안되어 있거나 브라우져에서 mediaDevice를 support 안함")
                return false;    
            })
        }else{
            alert("마이크 연결이 안되어 있거나 브라우져에서 mediaDevice를 support 안함")
            return false;
        }

    },[audioContext,audioSource,isVoiceRecorded,audioRef,canvasRef.current])

    const onClickStop = useCallback(()=>{
        if(isVoiceRecorded){
            stop();
            if(audioSource){
                audioSource.disconnect();
                setAudioSource(null);
            }
            if(audioContext){
                audioContext.close();
                setAudioContext(null);
            }
            setIsVoiceRecorded(false);

        }else{
            alert("음성녹음을 시작해주세요!");
        }
    },[audioContext,audioSource,isVoiceRecorded])



    return (
        <>
            <div>
                <button onClick={onClickRecordStart}>recordStart</button>
                <button onClick={onClickStop}>recordPause</button>
            </div>
            <div>
                <audio ref={audioRef} controls>
                </audio>
            </div>
            <div>{message}</div>
            <div>
                <canvas ref={canvasRef} style={{width:'400px',height:'200px'}}/>
            </div>
        </> 
    )
}

export default Example;