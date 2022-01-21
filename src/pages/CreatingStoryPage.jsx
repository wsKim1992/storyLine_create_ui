import React,{useState,createContext,useMemo, useReducer} from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
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

export const CHANGE_STORYPAGE_COVER = 'CHANGE_STORYPAGE_COVER';
export const CHANGE_TITLE_FONT_FAMILY = 'CHANGE_TITLE_FONT_FAMILY';
export const CHANGE_TITLE_FONT_SIZE = 'CHANGE_TITLE_FONT_SIZE';
export const CHANGE_TITLE_FONT_COLOR = 'CHANGE_TITLE_FONT_COLOR';
export const CHANGE_AUTHOR_FONT_FAMILY = 'CHANGE_AUTHOR_FONT_FAMILY';
export const CHANGE_AUTHOR_FONT_SIZE = 'CHANGE_AUTHOR_FONT_SIZE';
export const CHANGE_AUTHOR_FONT_COLOR = 'CHANGE_AUTHOR_FONT_COLOR';
export const ENABLE_TYPE_TEXT = 'ENABLE_TYPE_TEXT';
export const DISABLE_TYPE_TEXT = 'DISABLE_TYPE_TEXT';
export const CHANGE_INPUTYPE = 'CHANGE_INPUTYPE';
export const CHANGE_BASIC_FONT_SIZE = 'CHANGE_BASIC_FONT_SIZE';
export const CHANGE_BASIC_FONT_COLOR='CHANGE_BASIC_FONT_COLOR';
export const CHANGE_BASIC_FONT_FAMILY='CHANGE_BASIC_FONT_FAMILY';
export const INSERT_AUTHOR = 'INSERT_AUTHOR';
export const INSERT_TITLE = 'INSERT_TITLE';
export const DELETE_AUTHOR = 'DELETE_AUTHOR';
export const DELETE_TITLE = 'DELETE_TITLE';
export const MODIFY_AUTHOR = 'MODIFY_AUTHOR';
export const MODIFY_TITLE = 'MODIFY_TITLE';
export const MODIFY_AUTHOR_LOCATION = 'MODIFY_AUTHOR_LOCATION';
export const MODIFY_TITLE_LOCATION = 'MODIFY_TITLE_LOCATION';
export const MODIFY_AUTHOR_BREAK_POINT = 'MODIFY_AUTHOR_BREAK_POINT';
export const MODIFY_TITLE_BREAK_POINT = 'MODIFY_TITLE_BREAK_POINT';
export const POP_AUTHOR_BREAK_POINT = 'POP_AUTHOR_BREAK_POINT';
export const POP_TITLE_BREAK_POINT = 'POP_TITLE_BREAK_POINT';
export const INIT_TITLE_AUTHOR = 'INIT_TITLE_AUTHOR';

const INITIAL_FONT_SIZE = 32;

const InitialState = {
    storypage_cover:null,
    title:null,
    author:null,
    enableTypeText:false,
    inputType:'title',
    basicFontSize : INITIAL_FONT_SIZE,
    basicFontColor : '#454545',
    basicFontStyle: '\'ACCchildrenheartOTF-Regular\'',
    coverSampleList:['./assets/img/coverImg/fantasy/판타지1.jpg','./assets/img/coverImg/fantasy/판타지2.jpg'
        ,'./assets/img/coverImg/fantasy/판타지3.jpg','./assets/img/coverImg/fantasy/판타지4.jpg'
        ,'./assets/img/coverImg/fantasy/판타지5.jpg','./assets/img/coverImg/fantasy/판타지6.jpg'
        ,'./assets/img/coverImg/fantasy/판타지7.jpg','./assets/img/coverImg/fantasy/판타지8.jpg'
        ,'./assets/img/coverImg/fantasy/판타지9.jpg'
    ],
}

const initCanvas=(canvas)=>{
    canvas.width=768;canvas.height=1024;
    canvas.getContext('2d').fillStyle="fff";
    canvas.getContext('2d').fillRect(0,0,canvas.width,canvas.height);
}

const writeTextOnCanvas=(canvas,title,basicFontColor,basicFontStyle)=>{
    const titleTopRatio = title.topRatio;
    const titleLeftRatio = title.leftRatio;
    const newTop = canvas.height*titleTopRatio;
    const newLeft = canvas.width*titleLeftRatio;
    const fontSizeRatio = title.fontSizeRatio;
    const newFontSize = fontSizeRatio*canvas.height;
    const widthRatio = title.widthRatio;
    const newWidth = widthRatio*canvas.width;
    const text = title.text;
    console.log(`newTop : ${newTop}`);
    console.log(`newLeft : ${newLeft}`);
    const break_point_arr=title.break_point_arr;
    canvas.getContext('2d').textBaseline = 'ideographic';
    canvas.getContext('2d').textAlign = 'left';
    canvas.getContext('2d').font = `${newFontSize}px ${title.fontStyle?title.fontStyle:basicFontStyle}`;
    canvas.getContext('2d').fillStyle = title.fontColor?title.fontColor:basicFontColor;
    if(text){
        if(break_point_arr.length!=0){
            const stringArr = [];
            for(let i =0;i<break_point_arr.length;i++){
                const str=text.substring(i===0?i:break_point_arr[i-1],break_point_arr[i]);
                str.replace('\n','');
                if(str!==''){
                    stringArr.push(str);
                }
            }
            const lastString = text.substring(break_point_arr[break_point_arr.length-1],text.length);
            if(lastString!==''){stringArr.push(lastString);}
            //canvas.getContext('2d').fillText(stringArr.join('\n'),newLeft,newTop);
            for(let i =0 ;i<stringArr.length;i++){
                canvas.getContext('2d').fillText(stringArr[i],newLeft,newTop+((i+1)*newFontSize),newWidth);
            }
        }else{
            canvas.getContext('2d').fillText(text,newLeft,newTop+newFontSize,newWidth);
        }
    }else{
        canvas.getContext('2d').fillText('title',newLeft,newTop);
    }
}

const drawCanvas=(canvas,storypage_cover,title,author,basicFontStyle,basicFontSize,basicFontColor)=>{
    return new Promise((resolve,reject)=>{
        if(storypage_cover){
            let img = new Image();
            img.src=storypage_cover;
            img.onload = ()=>{
                canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
                if(title){
                    writeTextOnCanvas(canvas,title,basicFontColor,basicFontSize,basicFontStyle)
                }
                if(author){
                    writeTextOnCanvas(canvas,author,basicFontColor,basicFontSize,basicFontStyle)
                }
                resolve();
            }
        }
    })
}

export const StoryPageContext = createContext({
    storypage_cover:InitialState.storypage_cover,
    title:InitialState.title,
    author:InitialState.author,
    enableTypeText:InitialState.enableTypeText,
    inputType:InitialState.inputType,
    basicFontSize : InitialState.basicFontSize,
    basicFontColor : InitialState.basicFontColor,
    basicFontStyle: InitialState.basicFontStyle,
    dispatch:()=>{},
    coverSampleList:InitialState.coverSampleList,
    initCanvas,drawCanvas
})

const storyPageReducer = (state,action)=>{
    const {type}=action;
    switch (type){
        case INIT_TITLE_AUTHOR:{
            const {title,author}=action;
            return {...state,title,author};
        }
        case POP_AUTHOR_BREAK_POINT:{
            const {author} = state;
            const {index,text}=action;
            const {break_point_arr}=author;
            const newAuthor = {...author,break_point_arr:break_point_arr.filter(v=>v<text.length-1)};
            return {...state,author:newAuthor};
        }
        case POP_TITLE_BREAK_POINT:{
            const {title}=state;
            const {index,text}=action;
            const {break_point_arr}=title;
            const newTitle= {...title,break_point_arr:break_point_arr.filter(v=>v<text.length-1)};
            return {...state,title:newTitle};
        }
        case MODIFY_AUTHOR_BREAK_POINT:{
            const {index}=action;
            const {author}=state;
            if(index===author.break_point_arr[author.break_point_arr.length-1]){
                return state;
            }
            const newAuthor = {...author,break_point_arr:[...author.break_point_arr,index].sort((a,b)=>a>b)};
            return {...state,author:newAuthor};
        }
        case MODIFY_TITLE_BREAK_POINT:{
            const {index}=action;
            const {title}=state;
            if(index===title.break_point_arr[title.break_point_arr.length-1]){
                return state;
            }
            const newTitle = {...title,break_point_arr:[...title.break_point_arr,index].sort((a,b)=>a>b)};
            return {...state,title:newTitle};
        }
        case INSERT_AUTHOR :{
            return {...state,author:action.data};
        }
        case INSERT_TITLE :{
            return {...state,title:action.data};
        }
        case DELETE_AUTHOR :{
            return {...state,author:null};
        }
        case DELETE_TITLE :{
            return {...state,title:null};
        }
        case MODIFY_AUTHOR :{
            const {fontColor,fontStyle,fontSize,text,fontSizeRatio}=action.data;
            return {...state,author:{...state.author,fontColor,fontStyle,fontSize,text,fontSizeRatio}};
        }
        case MODIFY_TITLE :{
            const {fontColor,fontStyle,fontSize,text,fontSizeRatio}=action.data;
            return {...state,title:{...state.title,fontColor,fontStyle,fontSize,text,fontSizeRatio}};
        }
        case CHANGE_STORYPAGE_COVER:{
            const {storypage_cover} = action;
            return {...state,storypage_cover};
        }
        case ENABLE_TYPE_TEXT:{
            return {...state,enableTypeText:true};
        }
        case DISABLE_TYPE_TEXT:{
            return {...state,enableTypeText:false};
        }
        case CHANGE_INPUTYPE:{
            if(action.typename){
                return{...state,inputType:action.typename};
            }else{
                return{...state,inputType:state.inputType==='title'?'author':'title'};
            }
        }
        case CHANGE_BASIC_FONT_SIZE:{
            return {...state,basicFontSize:action.basicFontSize}
        }
        case CHANGE_BASIC_FONT_COLOR :{
            return {...state,basicFontColor:action.basicFontColor};
        }
        case CHANGE_BASIC_FONT_FAMILY:{
            const {inputType}=state;
            if(inputType==='author'&&state.author){
                const {author}=state;
                const newAuthor = {...author,fontStyle:action.basicFontStyle};
                return {...state,author:newAuthor,basicFontStyle:action.basicFontStyle};
            }else if(inputType==='title'&&state.title){
                const {title}=state;
                const newTitle = {...title,fontStyle:action.basicFontStyle};
                return {...state,title:newTitle,basicFontStyle:action.basicFontStyle}
            }
            return {...state,basicFontStyle:action.basicFontStyle};
        }
        case CHANGE_TITLE_FONT_SIZE:{
            const {title}=state;
            const newTitle= {...title,fontSize:action.fontSize};
            return {...state,title:newTitle};
        }
        case CHANGE_AUTHOR_FONT_SIZE:{
            const{author}=state;
            const newAuthor= {...author,fontSize:action.fontSize};
            return {...state,author:newAuthor};
        }
        case CHANGE_TITLE_FONT_COLOR:{
            const {title}=state;
            const newTitle={...title,fontColor:action.fontColor};
            return {...state,title:newTitle};
        }
        case CHANGE_AUTHOR_FONT_COLOR:{
            const {author}=state;
            const newAuthor = {...author,fontColor:action.fontColor};
            return {...state,author:newAuthor};
        }
        case MODIFY_AUTHOR_LOCATION:{
            const {width,height,top,left,id,topRatio,leftRatio}=action.data;
            const {author}=state;
            const newAuthor = {...author,width,height,top,left,id,topRatio,leftRatio};
            return {...state,author:newAuthor};
        }
        case MODIFY_TITLE_LOCATION:{
            const {width,height,top,left,id,topRatio,leftRatio}=action.data;
            const {title}=state;
            const newTitle = {...title,width,height,top,left,id,topRatio,leftRatio};
            return {...state,title:newTitle};
        }
        default :{
            return state;
        }
    } 
}

const CreatingStoryPage = ({history})=>{
    const [isShowBookCoverList,setIsShowBookCoverList]=useState(false);
    const [isShowLoadBookCoverUpload,setIsShowLoadBookCoverUpload]=useState(false);
    const [isShowPreview,setIsShowPreview]=useState(false);
    const [storyPageState,storyPageDispatch] = useReducer(storyPageReducer,InitialState);
    const {storyData} = useSelector(state=>state.storyData);
    const storyPageData = useMemo(()=>{
        return {
            storypage_cover:storyData.storypage_cover?storyData.storypage_cover:storyPageState.storypage_cover,
            title:storyData.title?storyData.title:storyPageState.title,
            author:storyData.author?storyData.author:storyPageState.author,
            enableTypeText:storyPageState.enableTypeText,
            dispatch:storyPageDispatch,
            inputType:storyPageState.inputType,
            basicFontSize:storyPageState.basicFontSize,
            basicFontColor:storyPageState.basicFontColor,
            basicFontStyle:storyPageState.basicFontStyle,
            coverSampleList:storyPageState.coverSampleList,
            initCanvas,drawCanvas
        }
    },[storyPageState])

    return(
        <StoryPageContext.Provider value={storyPageData}>
            <EntireWrap>
                <StyledContainer>
                    <CreateStoryPageHeader/>
                    <CreateStoryPageBody
                        isShowLoadBookCoverUpload={isShowLoadBookCoverUpload} 
                        setIsShowLoadBookCoverUpload={setIsShowLoadBookCoverUpload}
                        isShowBookCoverList={isShowBookCoverList} 
                        setIsShowBookCoverList={setIsShowBookCoverList}
                        isShowPreview={isShowPreview}
                        setIsShowPreview={setIsShowPreview}
                    />
                    <CreateStoryPageFooter 
                        setIsShowLoadBookCoverUpload={setIsShowLoadBookCoverUpload}
                        setIsShowBookCoverList={setIsShowBookCoverList}
                        setIsShowPreview={setIsShowPreview}
                    />
                </StyledContainer>
            </EntireWrap>
        </StoryPageContext.Provider>
    )
}

export default CreatingStoryPage;