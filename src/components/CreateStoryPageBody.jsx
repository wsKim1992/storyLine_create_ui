import React,{useEffect,useRef,useState} from 'react';
import styled from 'styled-components';
import { Image } from 'antd';
import {CaretLeftOutlined,CaretRightOutlined} from '@ant-design/icons'
import CreateStoryPageBookCoverList from './CreateStoryPageBookCoverList';

const StyledPageBodyWrap = styled.div`
    width:100%;
    height:78.5%;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    position:relative;
    overflow:hidden;
`;
const StyledCanvasWrap = styled.div`
    width:100%;
    height:100%;
    border:1px solid #454545;
    border-radius:10px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    @media screen and (max-width:910px){
        overflow:visible;
        position:relative;
    }
    .leftBtnWrap{
        @media screen and (max-width:910px){
            left:-3.5%;
            top:0px;
        }
    }
    .rightBtnWrap{
        @media screen and (max-width:910px){
            top:0px;
            right:-3.5%;
        }
    }
    @media screen (max-width:650px){
        width:80%;
    }
`;

const StyledBtnWrap = styled.p`
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    width:3.5%;
    height:100%;
    .anticon{
        color:#fff;
        font-size:15.5px;
    }
    @media screen and (max-width:910px){
        z-index:80
        position:absolute;
    }
`;

const CreateStoryPageBody = ({isShowBookCoverList})=>{
    const canvasRef = useRef(null);
    const canvasWrapRef = useRef(null);

    useEffect(()=>{
        
        const standardHeight = canvasWrapRef.current.getBoundingClientRect().height;
        const standardWidth = canvasWrapRef.current.getBoundingClientRect().width;
        const canvasHeight = standardHeight*0.95;
        const canvasWidth = canvasHeight*0.75; 
        
        if(standardWidth>canvasWidth){
            canvasRef.current.style.height = `${standardHeight*0.95}px`;
            canvasRef.current.style.width = `${standardHeight*0.95*0.75}px`;
            canvasRef.current.getContext('2d').fillStyle = '#fff';
            canvasRef.current.getContext('2d').fillRect(0,0,standardHeight*0.95*0.75,standardHeight*0.95);
        }else{
            canvasRef.current.style.height = `${standardHeight*0.95}px`;
            canvasRef.current.style.width = `${standardWidth*0.95}px`;
            canvasRef.current.getContext('2d').fillStyle = '#fff';
            canvasRef.current.getContext('2d').fillRect(0,0,standardWidth*0.95,standardHeight*0.95);
        }
    },[])

    return (
        <StyledPageBodyWrap >
            {isShowBookCoverList&&<CreateStoryPageBookCoverList/>}
            <StyledCanvasWrap ref={canvasWrapRef}>
                <StyledBtnWrap className="leftBtnWrap"><CaretLeftOutlined /></StyledBtnWrap>
                    <canvas style={{zIndex:'50'}} ref={canvasRef} id="canvas"></canvas>
                <StyledBtnWrap className="rightBtnWrap"><CaretRightOutlined /></StyledBtnWrap>
            </StyledCanvasWrap>
        </StyledPageBodyWrap>
    )
}

export default CreateStoryPageBody;