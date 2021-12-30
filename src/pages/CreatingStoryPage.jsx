import React,{useState,createContext} from 'react';
import styled from 'styled-components';
import CreateStoryPageBody from '../components/CreateStoryPageBody';
import CreateStoryPageFooter from '../components/CreateStoryPageFooter';
import CreateStoryPageHeader from '../components/CreateStoryPageHeader';

const EntireWrap = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    background-color: rgb(15,15,15);
`

const StyledContainer = styled.div`
    width:66.6%;
    height:100%;
    @media screen and (max-width:650px){
        width:80%;
    }
`

export const CreatingStoryContext = createContext({author:'',title:'',canvas:{fontSize:'15px',backgroundImg:null,fontStyle:''}})

const CreatingStoryPage = ({history})=>{
    const [isShowBookCoverList,setIsShowBookCoverList]=useState(false);
    
    return(
        <EntireWrap>
            <StyledContainer>
                <CreateStoryPageHeader/>
                <CreateStoryPageBody isShowBookCoverList={isShowBookCoverList}/>
                <CreateStoryPageFooter setIsShowBookCoverList={setIsShowBookCoverList}/>
            </StyledContainer>
        </EntireWrap>
    )
}

export default CreatingStoryPage;