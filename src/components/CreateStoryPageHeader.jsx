import React from 'react';
import styled from 'styled-components';
import {Button} from 'antd';

const StyledHeader = styled.div`
    width:100%;
    height:5.5%;
    background-color:#000;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items: center;
    margin:1.5% 0;
`

const StyledBtnListWrap =styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    width:33.3%;
    height:100%;
    @media screen and (max-width:650px){
        width:48.5%;
    }
    @media screen and (max-width:414px){
        width:45%;
    }
    .prev{
        background-color:rgba(35, 156, 158, 0.75);
    }
    .next{
        background-color:rgb(34,34,34);
    }
    
    
`

const StyledButton = styled(Button)`
    width: 39.5%;
    height:92%;
    border-radius:10.5px;
    border:none;
    color:#fff;
    
    &:hover{
        color:#fff;
        box-shadow:0px 0px 25px rgb(60, 60, 60);
    }
    
    @media screen and (min-width:601px){
        font-size:12.5px;
    }
    @media screen and (max-width:600px){
        font-size:7.5px;
    }
    
`;

const CreateStoryPageHeader = ()=>{

    return(
        <StyledHeader>
            <StyledBtnListWrap>
                <StyledButton className={"prev"}>
                    PREVIEW
                </StyledButton>
                <StyledButton className={"next"}>
                    NEXT
                </StyledButton>
            </StyledBtnListWrap>
        </StyledHeader>
    )
}

export default CreateStoryPageHeader;
