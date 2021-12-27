import React,{useState,useMemo,useRef,useCallback} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AudioOutlined,CaretRightFilled,PauseOutlined,SendOutlined } from '@ant-design/icons';
import { Button,Input } from 'antd';
import {useSpeechRecognition} from 'react-speech-kit';
import { useEffect } from 'react';

const EntireWrap = styled.div`
    color:#454545;
    position:absolute;
    bottom:0;
    width:68px;
    height:68px;
    padding:5.5px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items: center;
    background-color:#fff;
    border-radius:3.5px;
    border:none;
    z-index:100;
    color:${props=>props.color};
`;

const MainComponentWrap = styled.div`
    width:62.5px;
    height:62.5px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
`;

const MicComponentWrap = styled.div`
    width:100%;
    height:100%;
    display:flex;
    font-size:38px;
    border-radius:50%;
    border:2.5px solid #454545;
    flex-direction:row;
    align-items:center;
    justify-content:center;
`;

const TimerComponentWrap = styled.div`
    width:100%;
    height:20px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
`;
const TimerComponent = styled.div`
    width:30%;  
    height:100%;
    font-size:150%;
    text-align:center;
`;

const ButtonComponentWrap = styled.div`
    width:100%;
    height:70px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
`

const ButtonComponent = styled(Button)`
    width:auto;
    height:40px;
    border-radius:5.5px;
    font-size:90%;
    text-align:center;
    background-color:rgb(34, 34, 34);
    color:#fff;
    border:none;
    &:hover{
        transition:1.5s;
        border:none;
        background-color:rgb(70, 70, 70);
        color:#fff;
    }
    &:active{
        transition:1.5s;
        border:none;
        background-color:rgb(70, 70, 70);
        color:#fff;
    }
`

const RecordComponent = ({setIsSpeak,setMessage})=>{
    const [startListen,setStartListen] = useState(false);
    /* const [lapsedTime,setLapsedTime] = useState(`00:00`);
    const timerRef = useRef(null); */
    
    //const [startTime,setStartTime] = useState(null);

    const {listen,listening,stop}=useSpeechRecognition({
        onResult:(result)=>{
            console.log(result);
            setMessage(result);
        }
    })

    useEffect(()=>{

        return ()=>{
            stop();
            /*setStartTime(null);
            if(timerRef.current){
                clearInterval(timerRef.current);
                timerRef.current= null;
            }
            setLapsedTime('00:00'); */
        }
    },[])

    /* useEffect(()=>{
        if(startListen&&!startTime){
            setStartTime(Date.now())
        }else if(startListen&&startTime){
            timerRef.current = setInterval(()=>{
                const timeNow = Date.now();
                const dateObj = new Date(timeNow-startTime);
                const min = parseInt(dateObj.getMinutes()/10)!=0?dateObj.getMinutes():`0${dateObj.getMinutes()}`;
                const sec = parseInt(dateObj.getSeconds()/10)!=0?dateObj.getSeconds():`0${dateObj.getSeconds()}`;
                setLapsedTime(`${min}:${sec}`);
            },1000)
        }else if(!startListen){
            if(timerRef.current){
                setStartTime(null);
                clearInterval(timerRef.current);
                timerRef.current=null;
                setLapsedTime(`00:00`);
            }
        }
    },[startListen,startTime]) */

    const onClickStartListening = async()=>{
        if(startListen){
            stop();
            setStartListen(false);
            setIsSpeak(false);
        }else{
            console.log('mic on');
            listen({interimResults:true,lang:'ko-KR',continuous:true});
            setStartListen(true);
            /* try{
                const micDevice = await navigator.mediaDevices.getUserMedia({audio:true});
                console.log('mic on');
                listen({interimResults:true,lang:'ko-KR',continuous:true});
                setStartListen(true);
            }catch(err){
                setStartListen(false);
                return false;
            } */
        }
    }

    return (
        <EntireWrap color={startListen?'#40a3ff':'#454545'} onClick={onClickStartListening}>
            <MainComponentWrap >
                <MicComponentWrap>
                    <AudioOutlined />
                </MicComponentWrap>
            </MainComponentWrap>
            {/* <TimerComponentWrap>
                <TimerComponent>
                    {
                        lapsedTime
                    }
                </TimerComponent>
            </TimerComponentWrap> */}
            
            {/* <ButtonComponentWrap>
                <ButtonComponent onClick={onClickStartListening}>
                    {
                        startListen?(
                            <>
                                <PauseOutlined /> 녹음종료
                            </>
                        ):(
                            <>
                                <CaretRightFilled />녹음시작
                            </>
                        )
                    }
                </ButtonComponent>
            </ButtonComponentWrap> */}
        </EntireWrap>
    )
}

RecordComponent.propTypes={
    setIsSpeak:PropTypes.func
}

export default RecordComponent;