import React,{useState,useEffect,useRef} from 'react';
import styled from 'styled-components';
import {Image,Button} from 'antd';
import {LeftOutlined,RightOutlined} from '@ant-design/icons'
import { useCallback } from 'react';

const EntireWrap = styled.div`
    position:relative;
    overflow:hidden;
    width:100%;
    height:100%;
    z-index:100;
`

const StyledImageListsContainer = styled.div`
    position:absolute;
    top:0px;
    left:0px;
    z-index: 100;
    background-color:rgba(45,45,45,0.8);
    width:auto;
    height:100%;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    transition-duration: 0.8s;
    @media screen and (min-width:650px){
        left:33.3%;
    }
` 

const StyledImageWrap = styled.div`
    width:384px;
    height:512px;
    padding:${props=>props.index===0?'0px':'10px'};
    border:${props=>props.index===0?'10px solid #454545':'none'};
    @media screen and (max-width:550px){
        width:300px;
        height:400px;
    }
`;

const StyledBtnWrap = styled.div`
    width:33.3%;
    height:9.7%;
    z-index: 1000;
    position:absolute;
    top:5%;
    left:50%;
    transform:translateX(-50%);
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-evenly;
    color:white;
    @media screen and (max-width:950px){
        width:45%;
        height:8.5%;
        font-size:7.5px;
    }
    button{
        @media screen and (max-width:950px){
            font-size:7.5px;
        }
    }
`;

const StyledArrowButton = styled(Button)`
    width:20%;
    height:85%;
    border-radius:5px;
    border:none;
    background-color:rgba(35, 156, 158, 0.75);
`

const StyledEnterButton = styled(Button)`
    width:35%;
    height:85%;
    border-radius:5px;
    border:none;
    background-color:rgba(35, 156, 158, 0.75);
`

const CreateStoryPageBookCoverList = ()=>{

    const coverSampleList=['/assets/img/coverImg/fantasy/판타지1.jpg','/assets/img/coverImg/fantasy/판타지2.jpg'
        ,'/assets/img/coverImg/fantasy/판타지3.jpg','/assets/img/coverImg/fantasy/판타지4.jpg'
        ,'/assets/img/coverImg/fantasy/판타지5.jpg','/assets/img/coverImg/fantasy/판타지6.jpg'
        ,'/assets/img/coverImg/fantasy/판타지7.jpg','/assets/img/coverImg/fantasy/판타지8.jpg'
        ,'/assets/img/coverImg/fantasy/판타지9.jpg'];
    
    const imageRef = useRef([]);
    const imageListContainerRef = useRef([]);
    const [imageIndex,setImageIndex] = useState(0);


    const imageBefore = useCallback(()=>{
        const moveOffset = imageRef.current[imageIndex].getBoundingClientRect().width;
        const prevLeft = parseInt(imageListContainerRef.current.style.left.split("px")[0]);
        if(imageIndex-1<0){
            const containerWidth = imageListContainerRef.current.getBoundingClientRect().width;
            imageListContainerRef.current.style.left = `-${containerWidth-moveOffset}px`;
            imageRef.current[imageIndex].style.padding='10px';
            imageRef.current[imageIndex].style.border='none';
            imageRef.current[coverSampleList.length-1].style.padding='0px';
            imageRef.current[coverSampleList.length-1].style.border='10px solid rgb(69,69,69)';
            setImageIndex(coverSampleList.length-1);
        }else {
            
            imageListContainerRef.current.style.left = `${prevLeft+moveOffset}px`;
            imageRef.current[imageIndex].style.padding='10px';
            imageRef.current[imageIndex].style.border='none';
            imageRef.current[imageIndex-1].style.padding='0px';
            imageRef.current[imageIndex-1].style.border='10px solid rgb(69,69,69)';
            setImageIndex(imageIndex-1);
        }
    },[imageIndex,coverSampleList]);

    const imageAfter = useCallback((e)=>{
        if(imageIndex+1>coverSampleList.length-1){
            imageListContainerRef.current.style.left = `0px`;
            imageRef.current[imageIndex].style.padding='10px';
            imageRef.current[imageIndex].style.border='none';
            imageRef.current[0].style.padding='0px';
            imageRef.current[0].style.border='10px solid rgb(69,69,69)';
            setImageIndex(0);
        }else{  
            const prevLeft = parseInt(imageListContainerRef.current.style.left.split("px")[0]);
            const moveOffset = imageRef.current[imageIndex].getBoundingClientRect().width;
            imageListContainerRef.current.style.left = `-${(imageIndex)*moveOffset}px`;
            imageRef.current[imageIndex].style.padding='10px';
            imageRef.current[imageIndex].style.border='none';
            imageRef.current[imageIndex+1].style.padding='0px';
            imageRef.current[imageIndex+1].style.border='10px solid rgb(69,69,69)';
            setImageIndex(imageIndex+1);
        }
    },[imageIndex,coverSampleList]);

    return (
        <>
            <StyledBtnWrap>
                <StyledArrowButton onClick={imageBefore}>
                    <LeftOutlined />
                </StyledArrowButton>
                <StyledEnterButton>
                    SELECT
                </StyledEnterButton>
                <StyledArrowButton onClick={imageAfter}>
                    <RightOutlined />
                </StyledArrowButton>
            </StyledBtnWrap>
            <StyledImageListsContainer ref ={imageListContainerRef}>
                {
                    coverSampleList.map((v,i)=>(
                        <StyledImageWrap index={i} ref={ele=>imageRef.current[i]=ele} key={i}>
                            <Image src={v} key={`${i}_image`} width={"100%"} height={"100%"}/>
                        </StyledImageWrap>
                    ))
                }
            </StyledImageListsContainer>
        </>
    )
}

export default CreateStoryPageBookCoverList;