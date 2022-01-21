import React,{useState,useContext,useRef} from 'react';
import styled from 'styled-components';
import {LeftCircleOutlined,RightCircleOutlined,CloseOutlined} from '@ant-design/icons'
import { useCallback } from 'react';
import {CHANGE_STORYPAGE_COVER,StoryPageContext} from '../pages/CreatingStoryPage';

const StyledCloseButtonWrap = styled.div`
    height:5.22vh;
    width:5.22vh;
    position:absolute;
    top:1.5px;right:1.5px;
    z-index:1000;
    background-color:rgba(45,45,45,0.4);
    line-height:5.22vh;
    text-align:center;
    font-size:3.05vh;
    color:white;
`;

const StyledButtonWrap = styled.div`
    position:absolute;
    top:50%;left:50%;
    transform:translateX(-50%);
    z-index:1000;
    background-color:rgba(45,45,45,0.0);
    width:100%;
    height:5.22vh;
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    align-items:center;
`;

const StyledSingleButtonWrap = styled.div`
    height:5.22vh;
    width:5.22vh;
    text-align:center;
    line-height:5.22vh;
    font-size: 3.2vh;
    color:#fff;
    cursor:pointer;
`;

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
` 

const StyledImageWrap = styled.div`
    height:74.6vh;
    width:55.9vh;
    user-select:none;
    padding:${props=>props.index===0?'0px':'10px'};
    border:${props=>props.index===0?'10px solid #454545':'none'};
`;

const CreateStoryPageBookCoverList = ({setIsShowBookCoverList})=>{
    const imageListContainerRef = useRef(null);

    const {dispatch,coverSampleList}=useContext(StoryPageContext);
    
    const imageRef = useRef([]);
    const [isDraw,setIsDraw] = useState(false);
    const [prevX,setPrevX] = useState(-1);
    const [leftVal,setLeftVal]=useState(0);

    const onMouseStart = useCallback((evt)=>{
        if(imageListContainerRef.current){
            if(!isDraw){
                setPrevX(evt.changedTouches[0].clientX);
                setIsDraw(true);
            }else{
                return false;
            }
        }else{
            return false;
        }
    },[isDraw,imageListContainerRef.current])

    const onMouseDrag = useCallback((evt)=>{
        if(isDraw){
            const xAxisNow = evt.changedTouches[0].clientX;
            const diff = xAxisNow-prevX;
            imageListContainerRef.current.style.left = `${leftVal+diff}px`;
        }else{
            return false;
        }
    },[isDraw,prevX,imageListContainerRef.current]);

    const onMouseDragEnd = useCallback((evt)=>{
        setIsDraw(false);
        setPrevX(-1);
        setLeftVal(parseInt(imageListContainerRef.current.style.left.split("px")[0]));
    },[])

    const onClickLeft = (evt)=>{
        const offsetWidth = imageListContainerRef.current.getBoundingClientRect().width/coverSampleList.length;
        if(leftVal+offsetWidth>0){return false;}
        imageListContainerRef.current.style.left = `${leftVal+offsetWidth}px`;
        setLeftVal(prev=>prev+offsetWidth);
    }

    const onClickRight = (evt)=>{
        const offsetWidth = imageListContainerRef.current.getBoundingClientRect().width/coverSampleList.length;
        if(leftVal-offsetWidth<-imageListContainerRef.current.getBoundingClientRect().width-offsetWidth){return false;}
        imageListContainerRef.current.style.left = `${leftVal-offsetWidth}px`;
        setLeftVal(prev=>prev-offsetWidth);
    }

    const onClickImage = (src)=>{
        const tempImg = new Image();
        tempImg.src=src;
        tempImg.onload = ()=>{
            console.log(tempImg.src);
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = tempImg.width;tempCanvas.height = tempImg.height;
            tempCanvas.getContext('2d').drawImage(tempImg,0,0,tempCanvas.width,tempCanvas.height);
            dispatch({type:CHANGE_STORYPAGE_COVER,storypage_cover:tempCanvas.toDataURL('image/png')});
        } 
    }

    const onClockCloseButton = useCallback(()=>{
        setIsShowBookCoverList(false);
    },[])

    return (
        <>
            <StyledCloseButtonWrap onClick={onClockCloseButton}>
                <CloseOutlined/>
            </StyledCloseButtonWrap>
            <StyledButtonWrap>
                <StyledSingleButtonWrap onClick={onClickLeft}>
                    <LeftCircleOutlined/>
                </StyledSingleButtonWrap>
                <StyledSingleButtonWrap onClick={onClickRight}>
                    <RightCircleOutlined/>
                </StyledSingleButtonWrap>
            </StyledButtonWrap>
            <StyledImageListsContainer 
                onTouchStart={onMouseStart}
                onTouchMove={onMouseDrag}
                onTouchEnd={onMouseDragEnd}
                ref={imageListContainerRef}
            >
                {
                    coverSampleList.map((v,i)=>(
                        <StyledImageWrap onClick={()=>onClickImage(v)} isDraw={isDraw} index={i} ref={ele=>imageRef.current[i]=ele} key={i}>
                            <img src={v} key={`${i}_image`} width={"100%"} height={"100%"}/>
                        </StyledImageWrap>
                    ))
                }
            </StyledImageListsContainer>
        </>
    )
}

export default CreateStoryPageBookCoverList;