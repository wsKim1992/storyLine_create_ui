import React,{useState,useEffect, useCallback} from 'react';
import { useSelector } from 'react-redux';
import {Image} from 'antd';
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

const ShowAllOutputText = ({showPDFRef,pageCoverDataURL})=>{
    const {createdStory,creatingStory} = useSelector((state)=>state.storyline);
    const [fullText, setFullText]=useState(null);

    useEffect(()=>{
        setFullText(()=>{
            let textArr = createdStory.map((v,i)=>{
                return `${v.inputText}\n${v.outputText}`
            })
            textArr = [...textArr,`${creatingStory.inputText}\n${creatingStory.outputText[creatingStory.index]}`];
            return textArr;
        });
    },[])

    useEffect(()=>{
        console.log(showPDFRef.current.getBoundingClientRect());
    },[])

    return(
        
        <div ref={showPDFRef} style={{height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <StyledEntireWrap>
                <StyledImgWrap>
                    <StyledImgContainer>
                        <Image src={pageCoverDataURL} width={"100%"} height={"100%"}/>
                    </StyledImgContainer>
                </StyledImgWrap>
                {   
                    createdStory.map((v,i)=>{
                        return (
                            <StyledDivElement key={i}>
                                <StyledDivElement key={`${i}_input`}>
                                    {v.inputType!=='image'?
                                        v.inputText:
                                        <Image width={200} height={150} src={v.inputText}/>
                                    }
                                </StyledDivElement>
                                <StyledDivElement key={`${i}_output`}>{v.outputText}</StyledDivElement>
                            </StyledDivElement>)
                    })
                }
                {
                    creatingStory&&
                    <StyledDivElement>
                        <StyledDivElement>{creatingStory.inputType==='image'?<Image width={200} height={150} src={creatingStory.inputText}/>:creatingStory.inputText}</StyledDivElement>
                        <StyledDivElement>{creatingStory.outputText[creatingStory.index]}</StyledDivElement>
                    </StyledDivElement>
                }
            </StyledEntireWrap>
        </div>
   
    )
}


export default ShowAllOutputText;