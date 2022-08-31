import React from 'react';
import {Document,Text,Image,PageBreak } from 'redocx';
import {useSelector} from 'react-redux';

const StorylineWordDocument = ()=>{
    const {creatingStory,createdStory} = useSelector(state=>state.storyline);
    const {storyData} = useSelector(state=>state.storyData);
    return(
        <Document>
            <Image src={storyData.storypage_cover} align='center' width='1024' height='768'/>
            <PageBreak/>
        </Document>
    )
}

export default StorylineWordDocument;