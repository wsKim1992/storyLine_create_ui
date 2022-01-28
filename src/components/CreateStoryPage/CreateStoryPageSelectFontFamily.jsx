import React,{useContext} from 'react';
import styled from 'styled-components';
import {CloseOutlined} from '@ant-design/icons';
import {CHANGE_BASIC_FONT_FAMILY,CHANGE_TITLE_FONT_FAMILY,CHANGE_AUTHOR_FONT_FAMILY,StoryPageContext} from '../../pages/CreatingStoryPage';
import { useCallback } from 'react';

const StyledSelectFontFamilyWrap = styled.div`
    width:15.33%;
    height:175%;
    border:none;
    border-radius:10px;
    position:absolute;
    top:-175%;
    left:50%;
    transform:translateX(-50%);
    z-index:55;
    background-color:#454545;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:center;
    @media screen and (max-width:650px){
        width:33.3%;
    }
`

const StyledIconCloseBtnContainer = styled.div`
    width:100%;
    height:15.5%;
    background-color:#454545;
    padding:2.5%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    border-radius:10px;
`

const StyledIconWrapCloseBtn = styled.div`
    width:24px;
    height:24px;
    font-size:18.5px;
    line-height:24px;
    color:#fff;
    cursor:pointer;
`;

const StyledFontList = styled.div`
    height:74.5%;
    width:95%;
    background-color:#fff;
    border:none;
    border-radius:10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow:auto;
    ::-webkit-scrollbar{
        width:2.5px;
    }
`

const StyledFontElementContainer = styled.div`
    width:100%;
    height:100%;
`;

const StyledFontElement = styled.div`
    cursor:pointer;
    height:30px;
    line-height:30px;
    padding: 5px;
    width:95%;
    border:none;
    border-radius:10px;
    color:#000;
    background-color:${props=>props.color};
    font-family:${props=>props.fontStyle};
    font-size:15.5px;
    margin-left:2.5%;
    margin-top: 1.5%;
    text-align:center;
    &:last-child{
        margin-bottom:1.5%;
    }
    @media screen and (max-width:650px){
        font-size:12.5px;
    }
`

const CreateStoryPageSelectFontFamily = ({setShowSelectFont})=>{
    const {inputType,title,author,basicFontStyle,dispatch} = useContext(StoryPageContext);
    
    const fontStyleList = [
        '\'ACCchildrenheartOTF-Regular\'','\'SANGJUGyeongcheonIsland\'',
        '\'KyoboHandwriting2020A\'','\'establishRoomNo703OTF\'',
        '\'OTWelcomeRA\'',
    ];
    const onClickFontFamily = useCallback((v)=>{
        dispatch({type:CHANGE_BASIC_FONT_FAMILY,basicFontStyle:v});
    },[])

    return (
        <StyledSelectFontFamilyWrap>
            <StyledIconCloseBtnContainer>
                <StyledIconWrapCloseBtn onClick={()=>{setShowSelectFont(false)}}>
                    <CloseOutlined />
                </StyledIconWrapCloseBtn>
            </StyledIconCloseBtnContainer>
            <StyledFontList>
                <StyledFontElementContainer>
                    {fontStyleList.map((v,i)=>(
                        <StyledFontElement onClick={()=>onClickFontFamily(v)} key={`${i}_${v}`} fontStyle={v} color={basicFontStyle===v?'#454545':'#dbd3d6'}>
                            폰트
                        </StyledFontElement>
                    ))}
                </StyledFontElementContainer>
            </StyledFontList>
        </StyledSelectFontFamilyWrap>
    )
}

export default CreateStoryPageSelectFontFamily;