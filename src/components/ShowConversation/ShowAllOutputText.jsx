import React,{useState,useEffect, useCallback} from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const StyledEntireWrap = styled.div`
    width:100%;
    height:100%;
    background-color:rgb(34, 34, 34);
    font-family: 'Nanum Myeongjo';
`

const StyledDivElement = styled.div`
    width:100%;
    height:auto;
    font-size:18.5px;
    border:none;
    border-radius:9.5px;
    background-color:rgb(34, 34, 34);
    color:#fff; 
    padding:5px;
`

const StyledImgWrap = styled.div`
    width:100%;
    height:auto;
    background-color:#fff;
    display:flex;
    flex-direction:row;
    justify-content:center;
    background-color:rgb(34, 34, 34);
`
const StyledImgContainer = styled.div`
    width:49.72vh;
    height:66.3vh;
    background-color:#fff;
`;

const StyledImgCover = styled.img`
    display:block;
    width:100%;
    height:100%;
`;

const StyledStoryImg = styled.img`
    display:block;
    width:${props=>props.width}px;
    height:${props=>props.height}px;
`;

const ShowAllOutputText = ({showPDFRef,pageCoverDataURL,textElementsIntoPDFRef})=>{
    const {createdStory,creatingStory} = useSelector((state)=>state.storyline);
    const [fullText, setFullText]=useState(null);

    useEffect(()=>{
        setFullText(()=>{
            let textArr = createdStory.map((v,i)=>{
                return `${v.inputText}\n${v.outputText}`
            })
            if(creatingStory){
                textArr = [...textArr,`${creatingStory.inputText}\n${creatingStory.outputText[creatingStory.index]}`];
            }
            return textArr;
        });
    },[])

    const returnImgComponent = (src)=>{
        console.log(src);
        const img = new Image();
        img.src = src;
        const ratio = img.width/img.height;
        const newWidth = img.width>img.height?200:200*(ratio);
        const newHeight = img.width<img.height?200:200/(ratio);
        return (
            <StyledStoryImg src={src} width={newWidth} height={newHeight}/>
        );
    }

    return(
        
        <div ref={showPDFRef} style={{height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <StyledEntireWrap>
                {
                    pageCoverDataURL&&(
                        <StyledImgWrap>
                            <StyledImgContainer>
                                <StyledImgCover src={pageCoverDataURL}/>
                            </StyledImgContainer>
                        </StyledImgWrap>
                   )
                }
                <div ref={textElementsIntoPDFRef}>
                {   
                    createdStory.map((v,i)=>{
                        return (
                            <StyledDivElement key={i}>
                                <StyledDivElement key={`${i}_input`}>
                                    {v.inputType!=='image'?
                                        v.inputText:
                                        returnImgComponent(v.inputText)
                                    }
                                </StyledDivElement>
                                <StyledDivElement key={`${i}_output`}>{v.outputText}</StyledDivElement>
                            </StyledDivElement>)
                    })
                }
                {
                    creatingStory&&
                    <StyledDivElement>
                        <StyledDivElement>
                            {creatingStory.inputType==='image'?returnImgComponent(creatingStory?.inputText):creatingStory.inputText}
                        </StyledDivElement>
                        <StyledDivElement>{creatingStory.outputText[creatingStory.index]}</StyledDivElement>
                    </StyledDivElement>
                }
                </div>
            </StyledEntireWrap>
        </div>
    )
}


export default ShowAllOutputText;