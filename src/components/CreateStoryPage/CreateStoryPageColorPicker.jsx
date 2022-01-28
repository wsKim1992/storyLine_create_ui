import React,{useState,useCallback,useContext} from 'react';
import styled from 'styled-components';
import {HexColorPicker} from 'react-colorful';
import {CloseOutlined} from '@ant-design/icons'
import {StoryPageContext,CHANGE_BASIC_FONT_COLOR,CHANGE_TITLE_FONT_COLOR,CHANGE_AUTHOR_FONT_COLOR} from '../../pages/CreatingStoryPage';

const StyledColorPickerWrap = styled.div`
    width:200px;
    height:200px;
    position:absolute;
    top:-200px;
    left:50%;
    transform : translateX(-50%);
    background-color:#454545;
    border:none;
    border-radius:10px;
    z-index:53;
    @media screen and (max-width:650px){
        width:150px;height:150px;
        top:-150px;
    }
`;

const StyledCloseBtnWrap = styled.div`
    width:24px;height:24px;
    line-height:24px;
    position:absolute;
    top:2.5px;right:2.5px;
    font-size:18.5px;
    color:#fff;
    z-index:55;
    cursor:pointer;
`;

const CreateStoryPageColorPicker = ({setShowSelectColor})=>{
    const {basicFontColor,dispatch,inputType,title,author}=useContext(StoryPageContext);
    
    const onClickCloseBtn = useCallback((e)=>{
        e.stopPropagation();
        setShowSelectColor(false);
    },[])

    const onChangeColor=useCallback((value)=>{
        if(inputType==='title'&&title){
            dispatch({type:CHANGE_TITLE_FONT_COLOR,fontColor:value});
        }else if(inputType==='author'&&author){
            dispatch({type:CHANGE_AUTHOR_FONT_COLOR,fontColor:value});
        }else{
            dispatch({type:CHANGE_BASIC_FONT_COLOR,basicFontColor:value});
        }
    },[inputType,title,author])

    return (
        <StyledColorPickerWrap>
            <StyledCloseBtnWrap onClick={onClickCloseBtn}>
                <CloseOutlined />
            </StyledCloseBtnWrap>
            <HexColorPicker style={{width:'100%',height:'100%'}} color={basicFontColor} onChange={onChangeColor}/>
        </StyledColorPickerWrap>
    )
}

export default CreateStoryPageColorPicker;