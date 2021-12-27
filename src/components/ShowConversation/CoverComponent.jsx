import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types'; 
import { Image } from 'antd';

const StyledDiv = styled.div`
    position:absolute;
    top:0;left:0;
    display:flex;
    width:100%;
    height:100%;
    align-items:center;
    justify-content:center;
    background-color:rgba(45,45,45,0.9);
    z-index:2;
`
const CoverWrap = styled.div`
    position:absolute;
    @media screen and (max-width:600px){
        height:500px;
        width:333.2px;
    }
    @media screen and (min-width:601px) and (max-width:1024px){
        height:800px;
        width:532.8px;
    }
    @media screen and (min-width:1025px) and (max-width:1280px){
        height:920px;
        width:612.7px;
    }
    @media screen and (min-width:1281px){
        height:1020px;
        width:679.3px;
    }
`;

const CoverComponent = ({title,author,coverImage})=>{
    return(
        <StyledDiv>
            <CoverWrap>
                <Image preview={false} src={coverImage} width={"100%"} height={"100%"}/>
            </CoverWrap>
        </StyledDiv>
    )
}

export default CoverComponent;