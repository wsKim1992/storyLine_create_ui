import React,{useState,useRef,useCallback} from 'react';
import styled from 'styled-components';
import {Row,Col, Button} from 'antd';
import { useEffect } from 'react';

const StyledFooterWrap = styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    width:100%;height:12.5%;
`

const StyledFooter = styled.div`
    width:100%;
    height:90%;
    border-radius:10px;
    border:1px solid #454545;
    overflow:hidden;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    position:relative;
`;

const StyledBtnListWrap = styled(Row)`
    width:auto;
    height:80%;
    background-color:rgb(69, 69, 69);
    position:absolute; 
    right:45%;
    padding:5.5px;
`;

const StyledBtnWrap = styled(Col)`
    height:100%;
    width:70px;
`;

const StyledButton = styled(Button)`
    border-radius:5px;
    border:none;
    background-color:rgb(34, 34, 34);
    font-size:8.8px;
    height:100%;
    color:#fff;
    width:100%;
    &:hover{
        background-color:#454545;
        color:#fff;
    }
    &:focus{
        background-color:rgb(34, 34, 34);
        color:#fff;
    }
    @media screen and (max-width:650px){
        font-size: font-size:7.5px;
    }
`;

const CreateStoryPageFooter = ({setIsShowBookCoverList})=>{
    const [prevX,setPrevX]=useState(0);
    const [isTouched,setIsTouched]=useState(false);
    const footerRef = useRef(null);
    const btnListRef = useRef(null);

    useEffect(()=>{
        console.log(btnListRef.current.getBoundingClientRect());
        console.log(footerRef.current.getBoundingClientRect());
    },[])

    useEffect(()=>{
        console.log(isTouched);
    },[isTouched])

    const onTouchEnd=useCallback((e)=>{
        setIsTouched(false);
        setPrevX(-1);
    },[])

    const onTouchMove= useCallback((e)=>{
        if(isTouched){
            const offsetX = e.changedTouches[0].clientX;
            const diff = prevX-offsetX;
            let right = btnListRef.current.getBoundingClientRect().right;
            const footerRight = footerRef.current.getBoundingClientRect().right-0.25;
            right = footerRight-right;
            setPrevX(offsetX);
            btnListRef.current.style.right = `${right+diff}px`;
        }else{
            return false;
        }
    },[isTouched,prevX,btnListRef.current,footerRef.current])

    const onMoveStart=useCallback((e)=>{
        setPrevX(e.clientX);
        setIsTouched(true);
    },[])

    const onMoveEnd=useCallback((e)=>{
        setIsTouched(false);
        setPrevX(-1);
    },[])

    const onMoveMove = useCallback((e)=>{
        if(isTouched){
            const offsetX = e.clientX;
            const diff = prevX-offsetX;
            let right = btnListRef.current.getBoundingClientRect().right;
            const footerRight = footerRef.current.getBoundingClientRect().right-0.25;
            right = footerRight-right;
            setPrevX(offsetX);
            btnListRef.current.style.right = `${right+diff}px`;
        }else{
            return false;
        }
    },[isTouched,prevX,btnListRef.current,footerRef.current])

    const onTouchStart=useCallback((e)=>{
        setPrevX(e.changedTouches[0].clientX);
        setIsTouched(true);
    },[])

    const onMouseLeave=useCallback((e)=>{
        setPrevX(-1);
        setIsTouched(false);
    },[])

    const onClickShowAll = useCallback((e)=>{
        setIsShowBookCoverList(prev=>!prev);
    },[])

    return (
        <StyledFooterWrap>
            <StyledFooter ref={footerRef}>  
                <StyledBtnListWrap
                    ref={btnListRef}
                    onMouseUp={onMoveEnd}
                    onMouseMove={onMoveMove}
                    onMouseDown={onMoveStart}
                    onMouseLeave={onMouseLeave}
                    onTouchEnd={onTouchEnd}
                    onTouchMove={onTouchMove}
                    onTouchStart={onTouchStart}
                    gutter={[1.5,1.5]} 
                    wrap={false}
                >
                    <StyledBtnWrap span={1.5}>
                        <StyledButton>
                            Text
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton>
                            Font<br/>
                            Size
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton>
                            Font<br/>
                            Style
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton>
                            Load<br/>
                            Image
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton onClick={onClickShowAll}>
                            SHOW ALL<br/>
                            BOOK<br/>
                            COVER
                        </StyledButton>
                    </StyledBtnWrap>
                </StyledBtnListWrap>
            </StyledFooter>
        </StyledFooterWrap>
    )

}

export default CreateStoryPageFooter;