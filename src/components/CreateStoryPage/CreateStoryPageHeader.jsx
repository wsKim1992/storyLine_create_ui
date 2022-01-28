import React,{useState,useEffect,useContext,useCallback} from 'react';
import {Link,useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { StoryPageContext } from '../../pages/CreatingStoryPage';
import { STORYDATA_LOAD_REQUEST } from '../../../reducers/storyData';
import CommonHeader from '../CommonHeader';

const CreateStoryPageHeader = ()=>{
    const [sideMenuClicked,setSideMenuClicked]=useState(false);
    const {storyDataLoaded,storyDataLoading} = useSelector(state=>state.storyData);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const {title,author,storypage_cover,basicFontStyle,basicFontSize,basicFontColor,initCanvas,drawCanvas} = useContext(StoryPageContext);
    const updateStoryPageInfo = useCallback(async(evt)=>{
        const tempCanvas = document.createElement('canvas');
        initCanvas(tempCanvas);
        await drawCanvas(tempCanvas,storypage_cover,title,author,basicFontStyle,basicFontSize,basicFontColor);
        const pageCoverDataURL = tempCanvas.toDataURL('image/png');
        dispatch({type:STORYDATA_LOAD_REQUEST,navigate,data:{title,author,storypage_cover,pageCoverDataURL}})
    },[title,author,storypage_cover])

    /* useEffect(()=>{
        if(!storyDataLoading&& storyDataLoaded){
            navigate('/storyline',{replace:true})
        }
    },[storyDataLoaded,storyDataLoading]) */

    return(
        <CommonHeader title={"책 표지 제작"} onClickNextFunc={updateStoryPageInfo}/>
    )
}

export default CreateStoryPageHeader;
