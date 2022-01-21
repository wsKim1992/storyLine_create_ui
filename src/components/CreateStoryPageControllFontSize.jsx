import React,{useContext,useCallback,useMemo} from 'react';
import styled from 'styled-components';
import {Button, Slider} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import {CHANGE_BASIC_FONT_SIZE,CHANGE_TITLE_FONT_SIZE,CHANGE_AUTHOR_FONT_SIZE
    ,StoryPageContext} from '../pages/CreatingStoryPage';

const StyledControllFontSizeWrap = styled.div`
    display:flex;
    height:50%;width:50%;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    border:none;
    border-radius:5px;
    background-color:#454545;
    position:absolute;
    top:-50%;left:25%;
    z-index: 55;
    @media screen and (max-width:650px){
        height:65%;width:100%;
        top:-50%;left:0%;
    }
    .ant-slider{
        color:#fff;
        width:80%;
    }
`;

const StyledBtnWrap = styled.div`
    width:auto;
    height:auto;
    border-radius:5px;
    position:absolute;
    top:2.5%;right:2.5%;
    color:#fff;
`

const StyledCloseBtn = styled(Button)`
    width:100%;
    height:100%;
    background-color:#454545;
    color:#fff;
    display:flex;
    flex-dirction:row;
    align-items:center;
    justify-content:center;
    border:none;
    &:hover{
        background-color:#454545;
        color:#fff;
    }
`;

const CreateStoryPageControllFontSize=({setSelectFontSize})=>{ 
    const {inputType,author,title,basicFontSize,dispatch} = useContext(StoryPageContext);

    const onAfterChangeFontSize=(value)=>{
        if(inputType==='title'&&title){
            dispatch({type:CHANGE_TITLE_FONT_SIZE,fontSize:value});
        }else if(inputType==='author'&&author){
            dispatch({type:CHANGE_AUTHOR_FONT_SIZE,fontSize:value});
        }else{
            dispatch({type:CHANGE_BASIC_FONT_SIZE,basicFontSize:value});
        }
    }

    const marks=useMemo(()=>{
        return{
            28:'28px',
            68:'68px'
        }
    },[])
    return(
        <StyledControllFontSizeWrap>
            <StyledBtnWrap onClick={()=>setSelectFontSize(false)}>
                <CloseOutlined/>
            </StyledBtnWrap>
            <Slider color={'#fff'} min={28} max={68} marks={marks} defaultValue={basicFontSize} onAfterChange={onAfterChangeFontSize} />
        </StyledControllFontSizeWrap>
    )
}

export default CreateStoryPageControllFontSize;