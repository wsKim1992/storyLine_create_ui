import React,{useCallback,useContext,useRef} from 'react';
import styled from 'styled-components';
import {CloseOutlined} from '@ant-design/icons';
import { StoryPageContext } from '../../pages/CreatingStoryPage';
import { useEffect } from 'react';

const StyledPreviewWrap = styled.div`
    width:100%;
    height:100%;
    background-color:rgba(45,45,45,0.4);
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    position:absolute;
    z-index:500;
    top:0px;left:0px;
`;

const StyledCanvasWrap = styled.div`
    height:74.6vh;
    width:55.9vh;
    border:1px solid #454545;
    @media screen and (max-width:380px){
        height:81vh;
        width:60.75vh; 
    }
`;

const StyledCanvas = styled.canvas`
    height:100%;
    width:100%;
`

const StyledCloseButtonWrap = styled.div`
    position:absolute;
    top:3.5%;right:3.5%;
    width:30px;height:30px;
    background-color:rgba(45,45,45,0.4);
    display:flex;
    justify-content:center;
    align-items:center;
    margin:0;
    color:#fff;
    border-radius:45%;
`;

const StyledCloseButtonIcon = styled.p`
    width:100%;height:100%;
    font-size:25px;
    display:flex;
    justify-content:center;
    align-items:center;
    margin:0;
`;

const convertIntoNewText = (text,break_point_arr)=>{
    let arrToReturn = [];
    for(let i =0;i<break_point_arr.length;i++){
        console.log(break_point_arr[i]);
        const stringToPut = text.substring(i===0?i:break_point_arr[i-1],break_point_arr[i]).replace('\n','');
        if(stringToPut!=='')arrToReturn.push(stringToPut);
    }
    arrToReturn.push(text.substring(break_point_arr[break_point_arr.length-1],text.length));
    return arrToReturn.join('\n');
}

const drawCoverImageToCanvas = (storypage_cover,canvas,canvasWrap)=>{
    return new Promise((resolve,reject)=>{
        if(storypage_cover){
            const tempImg = new Image();
            tempImg.src=storypage_cover;
            tempImg.onload=()=>{
                canvas.getContext('2d').drawImage(tempImg,0,0,canvas.width,canvas.height);
                resolve();
            }
        }else{
            canvas.getContext('2d').fillStyle='#fff';
            canvas.getContext('2d').fillRect(0,0,canvas.width,canvas.height);
            resolve();
        }
    })
}

const writeTextOnCanvas=(canvas,title)=>{
    canvas.getContext('2d').textBaseline='ideographic';
    canvas.getContext('2d').textAlign='left';
    if(title){
        const {width,fontColor,fontStyle,fontSize,text,break_point_arr} = title;
        const titleTop = canvas.height * title.topRatio;
        const titleLeft = canvas.width * title.leftRatio;
        canvas.getContext('2d').font = `${fontSize?fontSize:basicFontSize}px ${fontStyle}`;
        canvas.getContext('2d').fillStyle = `${fontColor}`;
        if(text){
            const newText = convertIntoNewText(text,break_point_arr);
            const textArr = newText.split('\n');
            for(let i = 0 ;i<textArr.length;i++){
                canvas.getContext('2d').fillText(textArr[i],titleLeft,titleTop+((i+1)*fontSize),width);
            }
        }else{
            canvas.getContext('2d').fillText('title',titleLeft,titleTop,title.width)
        }
    }
}

const CreateStoryPagePreview=({standardHeight,isShowPreview,setIsShowPreview})=>{
    const {storypage_cover,title,author} = useContext(StoryPageContext);
    const canvasRef = useRef(null);
    const canvasWrapRef = useRef(null);

    const onClickCancel = useCallback(()=>{
        setIsShowPreview(false);
    },[])

    useEffect(async()=>{
        if(canvasRef.current&&canvasWrapRef.current){
            try{
                /* canvasRef.current.height = standardHeight*0.95;
                canvasRef.current.width = standardHeight*0.95*0.75;  */
                const canvasWrapRefStyle = document.defaultView.getComputedStyle(canvasWrapRef.current);
                console.log(canvasWrapRefStyle.height);
                console.log(canvasWrapRefStyle.width);
                canvasRef.current.width=parseFloat(canvasWrapRefStyle.width.split("px")[0]);
                canvasRef.current.height=parseFloat(canvasWrapRefStyle.height.split("px")[0]);
                canvasRef.current.getContext('2d').fillStyle="#fff";
                canvasRef.current.getContext('2d').fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
                await drawCoverImageToCanvas(storypage_cover,canvasRef.current,canvasWrapRef.current);
                canvasRef.current.getContext('2d').textBaseline='ideographic';
                canvasRef.current.getContext('2d').textAlign='left';
                writeTextOnCanvas(canvasRef.current,title);
                writeTextOnCanvas(canvasRef.current,author);
                
            }catch(err){
                console.error(err.message);
                alert(err.message);
            }
        }
    },[canvasRef.current,canvasWrapRef.current])

    return(
        <StyledPreviewWrap >
            <StyledCloseButtonWrap>
                <StyledCloseButtonIcon onClick={onClickCancel}>
                    <CloseOutlined />
                </StyledCloseButtonIcon>
            </StyledCloseButtonWrap>
            <StyledCanvasWrap ref = {canvasWrapRef}>
                <StyledCanvas ref = {canvasRef}/>
            </StyledCanvasWrap>
        </StyledPreviewWrap>
    )
}

export default CreateStoryPagePreview;