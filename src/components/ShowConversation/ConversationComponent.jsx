import React,{memo, useEffect} from 'react';
import SingleStoryLine from './SingleStoryLine';
import styled from 'styled-components';
import faker from 'faker';
import { useSelector } from 'react-redux';

/**
 * 'Nanum Myeongjo'
 * 'Open Sans'
 * 
 *  */

const StoryLineWrap = styled.div`
    width:90%;
    height:95%;
    font-family: 'Nanum Myeongjo';
`;

const ConversationComponent = memo(()=>{
    const {createdStory,creatingStory} = useSelector((state)=>state.storyline);
    
    return(
        <React.Fragment>
            <StoryLineWrap>
                {
                    createdStory.length!==0&&
                    createdStory.map((v,i)=>{
                        return(<SingleStoryLine style={{color:'#fff'}} key={v.id} data={v} isLastOne={false}/>)
                    })
                }
                {
                    creatingStory&&
                    <SingleStoryLine data={creatingStory} isLastOne={true}/>
                }
            </StoryLineWrap>
        </React.Fragment>
    )
})

export default ConversationComponent;