import React,{useState,useCallback} from 'react';
import styled from 'styled-components';
import {Button,Row,Col,Image} from 'antd';
import {ContainerOutlined,BookOutlined,FormOutlined,LeftOutlined,RightOutlined,MenuOutlined,HomeOutlined,ToolOutlined} from '@ant-design/icons';
import {Link,useLocation,useNavigate } from 'react-router-dom';

const StyledHeader = styled.div`
    width:100%;
    height:7.5%;
    background-color:#000;
    user-select:none;
    position:relative;
    font-family: '휴먼옛체';
`

const StyledRow = styled(Row)`
    width:100%;
    height:100%;
`;

const StyledCenteralCol = styled(Col)`
    display:flex;
    flex-direction:center;
    align-items:center;
    justify-content:center;
`

const StyledLogoWrap = styled.div`

`
const StyledTitleWrap = styled.div`
    height:100%;
    width:100%;
    text-align:center;
    line-height:5.22vh;
    font-size:3.2vh;
    color:#fff;
    @media screen and (max-width:650px){
        font-size:2.1vh;
    }
`;

const StyledCol = styled(Col)`
    display:flex;
    flex-direction:row;
    align-items:center;
`

const StyledSingleButtonWrap = styled.div`
    height:auto;
    width:auto;
    font-size: 3.2vh;
    color:#fff;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:${props=>props.flexOption};
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
    background-color:#000;
    font-size:3.2vh;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    color:#fff;
    padding:0px;
    border-radius:10px;
    &:focus{
        background-color:#000;
        color:#fff;
    }
    &:hover{
        background-color:#000;
        color:#fff;
    }
`

const StyledSideMenuContainer = styled.div`
    position:absolute;
    top:5.5vh;
    right:0;
    height:auto;
    padding:5px;
    width : 200px;
    background-color:#000;
    border:none;
    border-radius:10px;
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
    align-items:center;
    font-family: 'Noto Sans KR';
    z-index:52;
`;

const StyledMenuElement = styled.div`
    height:3.5vh;
    width:96.5%;
    padding:3.5%;
    border:none;
    border-radius:5px;
    background-color:#000;
    color:#fff;
    font-size:1.21vh;
    text-align:center;
    line-height:3.5vh;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:flex-start;

    &:hover{
        background-color:rgba(45,45, 45, 0.75);
        color:#fff;
    }
`;

const StyledLogoImage = styled(Image)`
    @media screen and (max-width:650px){
        display:none;
    }
`


const CommonHeader = ({title,onClickNextFunc})=>{
    const [sideMenuClicked,setSideMenuClicked]=useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const onClickBefore = ()=>{
        const lastPathName = location.pathname.split('/')[1];
        switch (lastPathName){
            case 'storyline':{
                navigate('/creating_story',{replace:true});
                break;
            }
            case 'creating_story':{
                navigate('/main',{replace:true});
                break;
            }
            default: break;
        }
    }

    return (
        <StyledHeader>
            <StyledRow align={"middle"} justify={"space-around"}>
                <Col span={6}>
                    <StyledSingleButtonWrap flexOption={"center"} onClick={onClickBefore}>
                        <StyledLogoImage src="/assets/img/logo.png" preview={false}/>
                    </StyledSingleButtonWrap>
                </Col>
                <StyledCenteralCol span={12}>  
                    <StyledSingleButtonWrap  flexOption={"center"} onClick={onClickBefore}>
                        <LeftOutlined/>
                    </StyledSingleButtonWrap>
                    <StyledTitleWrap>
                        {title}
                    </StyledTitleWrap>
                    <StyledSingleButtonWrap flexOption={"center"} onClick={onClickNextFunc}>
                        <RightOutlined/>
                    </StyledSingleButtonWrap>
                </StyledCenteralCol>
                <Col span={6}>
                    <StyledSingleButtonWrap flexOption={"flex-end"}>
                        <StyledButton onClick={()=>setSideMenuClicked(prev=>!prev)}>
                            <Image width={"60.5%"} preview={false} src="/assets/img/svg_img/menu.svg"/>
                            {
                                sideMenuClicked&&
                                <StyledSideMenuContainer>
                                    <StyledMenuElement>
                                        <span>
                                            <HomeOutlined /> &nbsp;홈으로
                                        </span>
                                    </StyledMenuElement>
                                    <StyledMenuElement>
                                        <span>
                                            <ToolOutlined /> &nbsp;설정
                                        </span>
                                    </StyledMenuElement>
                                    <StyledMenuElement>
                                        <span>
                                            <FormOutlined />&nbsp;요약
                                        </span>
                                    </StyledMenuElement>
                                    <StyledMenuElement>
                                        <span>
                                            <ContainerOutlined />&nbsp;전체보기
                                        </span>
                                    </StyledMenuElement>
                                    <StyledMenuElement>
                                        <span>
                                            <BookOutlined />&nbsp;작품등록하기
                                        </span>
                                    </StyledMenuElement>
                                </StyledSideMenuContainer>
                            }
                        </StyledButton>
                    </StyledSingleButtonWrap>
                </Col>
            </StyledRow>
            
        </StyledHeader>
    )
}

export default CommonHeader;
