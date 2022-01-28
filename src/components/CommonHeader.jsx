import React,{useState,useCallback} from 'react';
import styled from 'styled-components';
import {Button} from 'antd';
import {ContainerOutlined,BookOutlined,FormOutlined,LeftCircleOutlined,RightCircleOutlined,MenuOutlined,HomeOutlined,ToolOutlined} from '@ant-design/icons';
import {Link,useLocation,useNavigate } from 'react-router-dom';

const StyledHeader = styled.div`
    width:100%;
    height:5.5%;
    background-color:#000;
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    align-items: center;
    margin:1.5% 0;
    user-select:none;
    position:relative;
    font-family: '휴먼옛체';
`

const StyledMainButtonWrap = styled.div`
    width:92.5%;
    height:95%;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
`;

const StyledTitleWrap = styled.div`
    height:5.22vh;
    width:auto;
    text-align:center;
    line-height:5.22vh;
    font-size:3.2vh;
    color:#fff;
`;

const StyledSingleButtonWrap = styled.div`
    height:5.22vh;
    width:5.22vh;
    text-align:center;
    line-height:5.22vh;
    font-size: 3.2vh;
    color:#fff;
    a{color:#fff;}
`;

const StyledSideMenuWrap = styled.div`
    height:5.22vh;
    width:5.22vh;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
`

const StyledButton = styled(Button)`
    height:5vh;
    width:5vh;
    border:none;
    border-radius:10px;
    font-size:3.2vh;
    text-align:center;
    line-height:5vh;
    background-color:#454545;
    color:#fff;
    padding:0px;
    border-radius:10px;
    &:focus{
        background-color:#454545;
        color:#fff;
    }
    &:hover{
        background-color:#454545;
        color:#fff;
    }
`

const StyledSideMenuContainer = styled.div`
    position:absolute;
    top:5.5vh;
    right:0;
    height:15.5vh;
    width : 11.44vh;
    background-color:#000;
    border:none;
    border-radius:10px;
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
    align-items:center;
    z-index:52;
`;

const StyledMenuElement = styled.div`
    height:2.61vh;
    width:10vh;
    border:none;
    border-radius:5px;
    background-color:#000;
    color:#fff;
    font-size:1.21vh;
    text-align:left;
    line-height:2.61vh;
    &:hover{
        background-color:rgba(35, 156, 158, 0.75);
        color:#fff;
    }
`;

const CommonHeader = ({title,onClickNextFunc})=>{
    const [sideMenuClicked,setSideMenuClicked]=useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const onClickBefore = ()=>{
        const lastPathName = location.pathname.split('/')[1];
        console.log(`lastpathname : ${lastPathName}`);
        switch (lastPathName){
            case 'storyline':{
                navigate('/creating_story',{replace:true});
                break;
            }
            default: break;
        }
    }

    return (
        <StyledHeader>
            <StyledMainButtonWrap>
                <StyledSingleButtonWrap onClick={onClickBefore}>
                    <LeftCircleOutlined/>
                </StyledSingleButtonWrap>
                <StyledTitleWrap>
                    {title}
                </StyledTitleWrap>
                <StyledSingleButtonWrap onClick={onClickNextFunc}>
                    <RightCircleOutlined/>
                </StyledSingleButtonWrap>
            </StyledMainButtonWrap>
            <StyledSideMenuWrap>
                <StyledButton onClick={()=>setSideMenuClicked(prev=>!prev)}>
                    <MenuOutlined />
                </StyledButton>
            </StyledSideMenuWrap>
            {
                sideMenuClicked&&
                <StyledSideMenuContainer>
                <StyledMenuElement>
                    <HomeOutlined /> &nbsp;홈으로
                </StyledMenuElement>
                <StyledMenuElement>
                    <ToolOutlined /> &nbsp;설정
                </StyledMenuElement>
                <StyledMenuElement>
                    <FormOutlined />&nbsp;요약
                </StyledMenuElement>
                <StyledMenuElement>
                    <ContainerOutlined />&nbsp;전체보기
                </StyledMenuElement>
                <StyledMenuElement>
                    <BookOutlined />&nbsp;작품등록하기
                </StyledMenuElement>
            </StyledSideMenuContainer>
            }
        </StyledHeader>
    )
}

export default CommonHeader;
