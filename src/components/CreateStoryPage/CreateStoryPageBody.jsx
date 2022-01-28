import React, { useEffect, useCallback, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import CreateStoryPageBookCoverList from './CreateStoryPageBookCoverList';
import CreateStoryPageUploadImage from './CreateStoryPageUploadImage';
import {
    StoryPageContext, INSERT_AUTHOR, INSERT_TITLE,
    DELETE_TITLE, DELETE_AUTHOR, MODIFY_AUTHOR, MODIFY_TITLE,
    CHANGE_INPUTYPE, MODIFY_AUTHOR_LOCATION, MODIFY_TITLE_LOCATION,
    CHANGE_STORYPAGE_COVER, MODIFY_AUTHOR_BREAK_POINT, MODIFY_TITLE_BREAK_POINT,
    POP_AUTHOR_BREAK_POINT, POP_TITLE_BREAK_POINT, INIT_TITLE_AUTHOR
} from '../../pages/CreatingStoryPage';
import CreateStoryPagePreview from './CreateStoryPagePreview';
import { useSelector } from 'react-redux';

const StyledPageBodyWrap = styled.div`
    width:100%;
    height:85.5%;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    position:relative;
    overflow:hidden;
    @media screen and (max-width:910px){
        overflow:visible;
        position:relative;
    }
    @media screen and (max-width:380px){
        height:90%;
    }
`;
const StyledCanvasWrap = styled.div`
    width:100%;
    height:100%;
    border:1px solid #454545;
    border-radius:10px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    
    .leftBtnWrap{
        @media screen and (max-width:910px){
            left:-5.5%;
            top:0px;
        }
    }
    .rightBtnWrap{
        @media screen and (max-width:910px){
            top:0px;
            right:-5.5%;
        }
    }
    @media screen (max-width:650px){
        overflow:visible;
    }
`;
const StyledCanvasContainer = styled.div`
    height: 74.6vh;
    width : 55.9vh;
    position:relative;
    @media screen and (max-width:380px){
       height:81vh;
       width:60.75vh;
    }
`;

const StyledCanvas = styled.canvas`
    height: 100%;
    width : 100%;
    z-index:50;
`

const StyledBtnWrap = styled.p`
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    width:3.5%;
    height:100%;
    cursor:pointer;
    .anticon{
        color:#fff;
        font-size:15.5px;
    }
    @media screen and (max-width:910px){
        z-index:80;
        position:absolute;
    }
`;

const StyledTextAreaWrap = styled.div`
    width:auto;
    height:auto;
    position:absolute;
    top:${props => props.top}%;
    left:${props => props.left}%;
    z-index:51;
    border:none;
    cursor:move;
`

const StyledTextArea = styled.textarea`
    display:block;
    width:${props => props.width}px;
    height:${props => props.height}px;
    font-size:${props => props.fontSize}px;
    font-family:${props => props.fontStyle};
    color:${props => props.fontColor};
    border : 1px solid #454545;
    outline : none;
    user-select: none;
    padding:0px;
    line-height:${props => props.fontSize}px;
    background-color: transparent;
    overflow:hidden;
    resize:both;
    white-space:pre-line;
    &::-webkit-scrollbar {
        display:none;
    }
`

const StyledTextAreaButtonWrap = styled.div`
    position:absolute;
    top:1.5%;right:1.5%;
    font-size:13.5px;
    width:40px;height:20px;
    display:flex;
    flex-direction:row;
    justify-content:space-around;
    align-items:center;
    z-index:99;
`;

const StyledTextAreaDeleteButton = styled(Button)`
    width:18px;height:18px;
    font-size:13.5px;
    line-height:18px;
    padding:0px;
    border:none;
    background-color:rgba(35,156,158,0.75);
    color:#fff;
    border-radius:3.5px;
    &:hover{
        background-color:#1890ff;
        color:#fff;
    }
`;

const initTextArea = (canvas, topOffset, leftOffset, text, id, fontSize, width) => {
    const standardWidth = canvas.width;
    const standardHeight = canvas.height;
    const titleText = text;
    const titleId = `${id}_${Date.now()}`;
    const titleOriginalTopOffset = standardHeight / topOffset;
    const titleOriginalLeftOffset = (standardWidth-width)/2;
    const titleTop = titleOriginalTopOffset;
    const titleLeft = titleOriginalLeftOffset;
    const titleFontSize = fontSize
    const titleHeight = titleFontSize;
    const titleWidth = width;

    const titleTopRatio = titleOriginalTopOffset / canvas.height;
    const titleLeftRatio = titleOriginalLeftOffset / canvas.width;
    const titleHeightRatio = titleHeight / canvas.height;
    const titleWidthRatio = titleWidth / canvas.width;
    const titleFontSizeRatio = titleFontSize / canvas.height;
    const title = {
        id: titleId, text: titleText, top: titleTop, left: titleLeft
        , height: titleHeight, width: titleWidth, fontSize: titleFontSize,
        topRatio: titleTopRatio, leftRatio: titleLeftRatio,
        heightRatio: titleHeightRatio, widthRatio: titleWidthRatio,
        fontSizeRatio: titleFontSizeRatio, fontStyle: '\'SANGJUGyeongcheonIsland\'',
        fontColor: '#fff', break_point_arr: [],
    }
    return title;
}

const CreateStoryPageBody = ({
    isShowBookCoverList,
    setIsShowBookCoverList,
    isShowLoadBookCoverUpload,
    setIsShowLoadBookCoverUpload,
    isShowPreview,
    setIsShowPreview
}) => {
    const canvasRef = useRef(null);
    const canvasWrapRef = useRef(null);
    const [prevX, setPrevX] = useState(-1);
    const [prevY, setPrevY] = useState(-1);
    const [isDraw, setIsDraw] = useState(false);
    const [isTextAreaDraw, setIsTextAreaDraw] = useState(false);
    const [canvasURL, setCanvasURL] = useState(null);
    const [coverSampleImgIndex, setCoverSampleImgIndex] = useState(0);
    const [canvasInit, setCanvasInit] = useState(false);
    const { storypage_cover, basicFontSize, title, author, dispatch
        , basicFontColor, basicFontStyle, inputType, coverSampleList } = useContext(StoryPageContext);
    const [titleText, setTitleText] = useState('');
    const [authorText, setAuthorText] = useState('');
    const [textAreaOffsetX, setTextAreaOffsetX] = useState(-1);
    const [textAreaOffsetY, setTextAreaOffsetY] = useState(-1);
    const { storyData } = useSelector(state => state.storyData);

    useEffect(() => {
        if (canvasRef.current && canvasInit) {
            const standardWidth = canvasRef.current.width;
            const title = storyData.title ? storyData.title : initTextArea(canvasRef.current, 2, 3, 'book title', 'bookTitle', 44, 300);
            const author = storyData.author ? storyData.author : initTextArea(canvasRef.current, 1.5, 3, 'author', 'author', 35, 180);

            dispatch({ type: INIT_TITLE_AUTHOR, title, author });
            setTitleText(title.text); setAuthorText(author.text);
        }
    }, [canvasRef.current, canvasWrapRef.current, canvasInit])

    useEffect(() => {
        if (canvasWrapRef.current && canvasRef.current) {
            const style = document.defaultView.getComputedStyle(canvasWrapRef.current);
            canvasRef.current.height = parseFloat(style.height.split("px")[0]);
            canvasRef.current.width = parseFloat(style.width.split("px")[0]);
            setCanvasInit(true);
        }
    }, [canvasWrapRef.current, canvasWrapRef.current])

    useEffect(() => {
        if (canvasRef.current && canvasInit) {
            if (storypage_cover) {
                let tempImage = new Image();
                tempImage.src = storypage_cover;
                tempImage.onload = () => {
                    canvasRef.current.getContext('2d').drawImage(tempImage, 0, 0
                        , canvasRef.current.width 
                        , canvasRef.current.height);
                    setCanvasURL(canvasRef.current.toDataURL('image/png'));
                }
            } else {
                dispatch({ type: CHANGE_STORYPAGE_COVER, storypage_cover: coverSampleList[coverSampleImgIndex] });
            }
        }
    }, [canvasRef.current, canvasInit, storypage_cover])

    const onMouseDown = useCallback((evt) => {
        if (canvasRef.current) {
            if (!isDraw) {
                setIsDraw(true);
                if (!evt.changedTouches) {
                    const { offsetX, offsetY } = evt.nativeEvent;
                    setPrevX(offsetX); setPrevY(offsetY);
                } else {
                    const { clientX, clientY } = evt.changedTouches[0];
                    const canvasTop = canvasRef.current.getBoundingClientRect().y;
                    const canvasLeft = canvasRef.current.getBoundingClientRect().x;
                    setPrevX(clientX - canvasTop); setPrevY(clientY - canvasLeft);
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }, [isDraw, canvasRef.current])

    const onMouseMove = useCallback((evt) => {
        if (canvasRef.current) {
            if (!isDraw) { return false; }
            const offsetX = evt.changedTouches ? evt.changedTouches[0].clientX : evt.nativeEvent.offsetX;
            const offsetY = evt.changedTouches ? evt.changedTouches[0].clientY : evt.nativeEvent.offsetY;
            const width = offsetX - prevX;
            const height = offsetY - prevY;
            let img = new Image();
            img.onload = function () {
                canvasRef.current.getContext('2d').drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                canvasRef.current.getContext('2d').strokeRect(prevX, prevY, width, height);
            }
            img.src = canvasURL;
        } else {
            return false;
        }
    }, [isDraw, canvasRef.current])

    const onMouseUp = (evt) => {
        const offsetX = evt.changedTouches ? evt.changedTouches[0].clientX : evt.nativeEvent.offsetX;
        const offsetY = evt.changedTouches ? evt.changedTouches[0].clientY : evt.nativeEvent.offsetY;
        const lineWidth = canvasRef.current.getContext('2d').lineWidth;
        const width = evt.changedTouches ? (offsetX - canvasRef.current.getBoundingClientRect().x) - prevX : offsetX - prevX;
        const widthRatio = width / canvasRef.current.width;
        const height = evt.changedTouches ? (offsetY - canvasRef.current.getBoundingClientRect().y) - prevY : offsetY - prevY;
        const top = prevY;
        const left = prevX;
        const topRatio = parseFloat(prevY / canvasRef.current.height);
        const leftRatio = parseFloat(prevX / canvasRef.current.width);
        const fontSizeRatio = basicFontSize / canvasRef.current.height;
        if (inputType === 'title') {
            if (!title) {
                dispatch({ type: INSERT_TITLE, data: { topRatio, leftRatio, width, height: (basicFontSize), top, left, id: Date.now(), text: '제목을 입력해 주세요', break_point_arr: [], fontSizeRatio, widthRatio } });
            }
        } else {
            if (!author) {
                dispatch({ type: INSERT_AUTHOR, data: { topRatio, leftRatio, width, height: (basicFontSize), top, left, id: Date.now(), text: '작가명을 입력해 주세요', break_point_arr: [], fontSizeRatio, widthRatio } });
            }
        }
        let img = new Image();
        img.onload = () => {
            canvasRef.current.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        }
        img.src = canvasURL;
        setIsDraw(false);
        setPrevX(-1); setPrevY(-1);
    }

    const onTouchStart = useCallback((evt) => {
        if (canvasRef.current) {
            if (!isDraw) {
                const { clientX, clientY } = evt.changedTouches[0];
                const offsetX = clientX - canvasRef.current.getBoundingClientRect().x;
                const offsetY = clientY - canvasRef.current.getBoundingClientRect().y;
                setPrevX(offsetX); setPrevY(offsetY);
                setIsDraw(true);
            } else {
                return false;
            }
        } else {
            return false;
        }
    }, [isDraw, canvasRef.current])

    const onTouchMove = useCallback((evt) => {
        if (canvasRef.current) {
            if (!isDraw) { return false; }
            const { clientX, clientY } = evt.changedTouches[0];
            const offsetX = clientX - canvasRef.current.getBoundingClientRect().x;
            const offsetY = clientY - canvasRef.current.getBoundingClientRect().y;
            const width = offsetX - prevX;
            const height = offsetY - prevY;
            let img = new Image();
            img.onload = function () {
                canvasRef.current.getContext('2d').drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                canvasRef.current.getContext('2d').strokeRect(prevX, prevY, width, height);
            }
            img.src = canvasURL;
        } else {
            return false;
        }
    }, [isDraw, canvasRef.current, prevX, prevY])

    const onTouchEnd = useCallback((evt) => {
        if (canvasRef.current) {
            if (!isDraw) { return false; }
            const { clientX, clientY } = evt.changedTouches[0];
            const offsetX = clientX - canvasRef.current.getBoundingClientRect().x;
            const offsetY = clientY - canvasRef.current.getBoundingClientRect().y;
            
            const width = offsetX - prevX; const height = offsetY - prevY;
            let top = prevY ;
            let left = prevX ;
            const topRatio = parseFloat(top/canvasRef.current.height);
            const leftRatio = parseFloat(left/canvasRef.current.width);
            
            const fontSize = basicFontSize;
            if (inputType === 'title') {
                if (!title) {
                    dispatch({ type: INSERT_TITLE, data: { topRatio, leftRatio ,width, height:fontSize, top, left, id: Date.now()}});
                } 
            } else {
                if (!author) {
                    dispatch({ type: INSERT_AUTHOR, data: { topRatio, leftRatio ,width, height:fontSize, top, left, id: Date.now()}});
                } 
            }

            let img = new Image();
            img.onload = () => {
                canvasRef.current.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
            }
            img.src = canvasURL;
            setIsDraw(false);
            setPrevX(-1); setPrevY(-1);
        }
    }, [isDraw, canvasRef.current, prevX, prevY])

    const onClickDeleteButton = useCallback((type) => {
        if (type === 'title') {
            dispatch({ type: DELETE_TITLE });
        } else {
            dispatch({ type: DELETE_AUTHOR });
        }
    }, []);

    const onClickCheckButton = useCallback((data, thisInputType) => {
        const { id, left, top } = data;
        const textAreaElement = document.getElementById(`${id}`);
        const style = document.defaultView.getComputedStyle(textAreaElement);
        const fontColor = style.getPropertyValue('color');
        const fontStyle = `\'${style.getPropertyValue('font-family')}\'`;
        const fontSize = parseFloat(style.getPropertyValue('font-size').split("px")[0]);
        const fontSizeRatio = fontSize / canvasRef.current.getBoundingClientRect().height;
        const text = textAreaElement.value; 
        if (thisInputType === 'title') {
            dispatch({ type: MODIFY_TITLE, data: { fontColor, fontStyle, fontSize, text, fontSizeRatio } });
        } else if (thisInputType === 'author') {
            dispatch({ type: MODIFY_AUTHOR, data: { fontColor, fontStyle, fontSize, text, fontSizeRatio } });
        }
        document.getElementById(`${id}`).style.border = 'none';
        document.getElementById(`${id}`).style.backgroundColor = 'transparent';
        document.getElementById(`${id}_btnWrap`).style.display = 'none';
    }, [])

    const onClickTextArea = useCallback((evt, type, id) => {
        document.getElementById(`${id}`).style.border = '1px solid #454545';
        document.getElementById(`${id}`).style.backgroundColor = 'transparent';
        document.getElementById(`${id}_btnWrap`).style.display = 'flex';
        document.getElementById(`${id}_wrap`).style.border = '1px solid #454545';
        dispatch({ type: CHANGE_INPUTYPE, typename: type });
    }, [])

    const onLeftClick = useCallback((evt) => {
        if (coverSampleImgIndex - 1 < 0) {
            dispatch({ type: CHANGE_STORYPAGE_COVER, storypage_cover: coverSampleList[coverSampleList.length - 1] });
            setCoverSampleImgIndex(coverSampleList.length - 1);
        } else {
            dispatch({ type: CHANGE_STORYPAGE_COVER, storypage_cover: coverSampleList[coverSampleImgIndex - 1] });
            setCoverSampleImgIndex(coverSampleImgIndex - 1);
        }
    }, [coverSampleImgIndex, storypage_cover])

    const onRightClick = useCallback((evt) => {
        if (coverSampleImgIndex + 1 >= coverSampleList.length) {
            dispatch({ type: CHANGE_STORYPAGE_COVER, storypage_cover: coverSampleList[0] });
            setCoverSampleImgIndex(0);
        } else {
            dispatch({ type: CHANGE_STORYPAGE_COVER, storypage_cover: coverSampleList[coverSampleImgIndex + 1] });
            setCoverSampleImgIndex(coverSampleImgIndex + 1);
        }
    }, [coverSampleImgIndex, storypage_cover])

    const onMouseEnterTextArea = useCallback((id) => {
        document.getElementById(`${id}`).style.border = '1px solid #454545';
        document.getElementById(`${id}`).style.backgroundColor = 'transparent';
        document.getElementById(`${id}_btnWrap`).style.display = 'flex';
        document.getElementById(`${id}_wrap`).style.border = '1px solid #454545';
    }, [])

    const onMouseLeaveTextArea = useCallback((id) => {
        if (isTextAreaDraw) {
            setIsTextAreaDraw(false);
            setPrevX(-1); setPrevY(-1);
        } else {
            document.getElementById(`${id}`).style.border = 'none';
            document.getElementById(`${id}`).style.backgroundColor = 'transparent';
            document.getElementById(`${id}_btnWrap`).style.display = 'none';
            document.getElementById(`${id}_wrap`).style.border = 'none';
        }
    }, [isTextAreaDraw])

    const onMouseDownTextArea = useCallback((evt,textAreaId) => {
        if (!isTextAreaDraw) {
            const textAreaElement= document.getElementById(textAreaId);
            textAreaElement.style.pointerEvents='none';
            textAreaElement.style.userSelect='none';
            setIsTextAreaDraw(true);
            setTextAreaOffsetX(evt.nativeEvent.offsetX); setTextAreaOffsetY(evt.nativeEvent.offsetY);
        }
    }, [isTextAreaDraw])

    const onMouseMoveTextArea = useCallback((evt, id) => {
        evt.stopPropagation();
        if (isTextAreaDraw) {
            const thisTextArea = document.getElementById(id);
            const newLeft = evt.clientX - canvasWrapRef.current.getBoundingClientRect().x - textAreaOffsetX;
            const newTop = evt.clientY - canvasWrapRef.current.getBoundingClientRect().y - textAreaOffsetY;
            const thisTextAreaWidth = parseFloat(document.defaultView.getComputedStyle(thisTextArea).width.split("px")[0]);
            const thisTextAreaHeight = parseFloat(document.defaultView.getComputedStyle(thisTextArea).height.split("px")[0]);
            if(newLeft<=0 || newTop<=0 
                || newLeft+thisTextAreaWidth>canvasRef.current.width 
                || newTop+thisTextAreaHeight>canvasRef.current.height){
                setIsTextAreaDraw(false);
                setTextAreaOffsetX(-1);
                setTextAreaOffsetY(-1);
                return false;
            }

            thisTextArea.style.left = `${newLeft}px`;
            thisTextArea.style.top = `${newTop}px`;
        }
    }, [isTextAreaDraw, textAreaOffsetX, textAreaOffsetY]);

    const onMouseUpTextArea = useCallback((flag, id) => {
        if (isTextAreaDraw) {
            document.getElementById(id.slice(0,id.lastIndexOf("_"))).style.pointerEvents='auto';
            document.getElementById(id.slice(0,id.lastIndexOf("_"))).style.userSelect='auto';
            const thisTextArea = document.getElementById(id);
            const style = document.defaultView.getComputedStyle(thisTextArea);
            const left = parseFloat(style.getPropertyValue("left").split('px')[0]);
            const top = parseFloat(style.getPropertyValue("top").split('px')[0]);
            const width = parseFloat(style.getPropertyValue("width").split('px')[0]);
            const height = parseFloat(style.getPropertyValue("height").split('px')[0]);

            const topRatio = parseFloat((top) / canvasRef.current.height);
            const leftRatio = parseFloat((left) / canvasRef.current.width);

            dispatch({ type: flag === 'author' ? MODIFY_AUTHOR_LOCATION : MODIFY_TITLE_LOCATION, data: { topRatio, leftRatio, width, height, top, left, id } })
            setIsTextAreaDraw(false);
            setTextAreaOffsetX(-1); setTextAreaOffsetY(-1);
            document.body.style.overflow = "auto";
        }
    }, [isTextAreaDraw]);

    const onChangeTextArea = (evt, id, authorOrTitle) => {
        const textArea = document.getElementById(id);
        const style = document.defaultView.getComputedStyle(textArea);
        const height = textArea.style.height ? parseFloat(textArea.style.height.split("px")[0]) : parseFloat(style.height.split("px")[0]);
        const scrollHeight = textArea.scrollHeight;
        if (scrollHeight > height) {
            textArea.style.height = `${scrollHeight}px`;
            const index = textArea.selectionStart;
            dispatch({
                type: authorOrTitle === 'author' ? MODIFY_AUTHOR_BREAK_POINT : MODIFY_TITLE_BREAK_POINT,
                index
            });
        } else if (scrollHeight < height) {
            textArea.style.height = `${scrollHeight}px`;
        }
        if (authorOrTitle === 'title') { setTitleText(evt.target.value); }
        else { setAuthorText(evt.target.value); }
    }

    const onKeyDownTextArea = (evt, id, authorOfTitle) => {
        const keyCode = evt.keyCode;
        const textArea = document.getElementById(id);
        const index = textArea.selectionStart;
        if (keyCode === 8) {
            const value = textArea.value
            const recentBreakPoint = authorOfTitle === 'author'
                ? author.break_point_arr[author.break_point_arr.length - 1]
                : title.break_point_arr[title.break_point_arr.length - 1];
            if (index < recentBreakPoint) {
                dispatch({
                    type: authorOfTitle === 'author' ? POP_AUTHOR_BREAK_POINT : POP_TITLE_BREAK_POINT,
                    index,
                    text: value
                })
            }
        }
    }

    const onTouchStartTextArea = useCallback((evt, id) => {
        if (!isTextAreaDraw) {
            const { clientX, clientY } = evt.changedTouches[0];
            const { x, y } = document.getElementById(id).getBoundingClientRect();
            const newXVal = clientX - x;
            const newYVal = clientY - y;
            setTextAreaOffsetX(newXVal);
            setTextAreaOffsetY(newYVal);
            const textAreaId = id.slice(0,id.lastIndexOf("_"));
            document.getElementById(textAreaId).style.pointerEvents="none";
            document.body.style.overflow = "hidden";
            setIsTextAreaDraw(true);
        }
    }, [isTextAreaDraw])

    const onTouchMoveTextArea = (evt, id) => {
        if(isTextAreaDraw){
            const { clientX, clientY } = evt.changedTouches[0];
            const { x, y } = canvasRef.current.getBoundingClientRect();
            const newLeft = clientX - x - textAreaOffsetX;
            const newTop = clientY - y - textAreaOffsetY;
            const textArea = document.getElementById(id);
            const thisTextAreaWidth = parseFloat(document.defaultView.getComputedStyle(textArea).width.split("px")[0]);
            const thisTextAreaHeight = parseFloat(document.defaultView.getComputedStyle(textArea).height.split("px")[0]);
            if(newLeft<=0 || newTop<=0
                || newLeft+thisTextAreaWidth >canvasRef.current.width
                || newTop+thisTextAreaHeight>canvasRef.current.height
            ){
                setIsTextAreaDraw(false);
                setTextAreaOffsetX(-1);
                setTextAreaOffsetY(-1);
                return false;
            }
            
            textArea.style.left = `${newLeft}px`;
            textArea.style.top = `${newTop}px`; 
        }
    };
    
    return (
        <StyledPageBodyWrap >
            {isShowLoadBookCoverUpload && <CreateStoryPageUploadImage setIsShowLoadBookCoverUpload={setIsShowLoadBookCoverUpload} />}
            {isShowBookCoverList && <CreateStoryPageBookCoverList setIsShowBookCoverList={setIsShowBookCoverList} />}
            <StyledCanvasWrap>
                <StyledBtnWrap onClick={onLeftClick} className="leftBtnWrap"><CaretLeftOutlined /></StyledBtnWrap>
                <StyledCanvasContainer ref={canvasWrapRef}>
                    <StyledCanvas
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        ref={canvasRef} id="canvas"
                    >
                    </StyledCanvas>
                    {
                        author &&
                        (
                            <StyledTextAreaWrap
                                id={`${author.id}_wrap`}
                                top={author.topRatio * 100}
                                left={author.leftRatio * 100}
                                onMouseDown={(evt)=>onMouseDownTextArea(evt,author.id)}
                                onMouseMove={(evt) => onMouseMoveTextArea(evt, `${author.id}_wrap`)}
                                onMouseUp={() => onMouseUpTextArea('author', `${author.id}_wrap`)}
                                onMouseEnter={() => onMouseEnterTextArea(author.id)}
                                onMouseLeave={() => onMouseLeaveTextArea(author.id)}
                                onTouchEnd={(evt) => onMouseUpTextArea('author', `${author.id}_wrap`)}
                                onTouchMove={(evt) => onTouchMoveTextArea(evt, `${author.id}_wrap`)}
                                onTouchStart={(evt) => onTouchStartTextArea(evt, `${author.id}_wrap`)}
                            >
                                <StyledTextAreaButtonWrap id={`${author.id}_btnWrap`}>
                                    <StyledTextAreaDeleteButton onClick={() => { onClickDeleteButton('author') }}>
                                        <CloseOutlined />
                                    </StyledTextAreaDeleteButton>
                                    <StyledTextAreaDeleteButton onClick={() => { onClickCheckButton({ id: author.id, top: author.top, left: author.left }, 'author') }}>
                                        <CheckOutlined />
                                    </StyledTextAreaDeleteButton>
                                </StyledTextAreaButtonWrap>
                                <StyledTextArea
                                    value={authorText}
                                    data-gramm="false"
                                    data-gramm_editor="false"
                                    data-enable-grammarly="false"
                                    onKeyDown={(evt) => onKeyDownTextArea(evt, author.id, 'author')}
                                    onChange={(evt) => onChangeTextArea(evt, author.id, 'author')}
                                    onFocus={(evt) => onClickTextArea(evt, 'author', author.id)}
                                    id={author.id}
                                    spellcheck="false"
                                    width={author.width}
                                    height={author.fontSize ? author.fontSize : basicFontSize}
                                    fontColor={author.fontColor ? author.fontColor : basicFontColor}
                                    fontSize={author.fontSize ? author.fontSize : basicFontSize}
                                    fontStyle={author.fontStyle ? author.fontStyle : basicFontStyle}
                                /></StyledTextAreaWrap>
                        )
                    }
                    {
                        title &&
                        (
                            <StyledTextAreaWrap
                                id={`${title.id}_wrap`}
                                top={title.topRatio * 100}
                                left={title.leftRatio * 100}
                                onMouseDown={(evt)=>onMouseDownTextArea(evt,title.id)}
                                onMouseMove={(evt) => onMouseMoveTextArea(evt, `${title.id}_wrap`)}
                                onMouseUp={() => onMouseUpTextArea('title', `${title.id}_wrap`)}
                                onMouseEnter={() => onMouseEnterTextArea(title.id)}
                                onMouseLeave={() => onMouseLeaveTextArea(title.id)}
                                onTouchEnd={(evt) => onMouseUpTextArea('title', `${title.id}_wrap`)}
                                onTouchMove={(evt) => onTouchMoveTextArea(evt, `${title.id}_wrap`)}
                                onTouchStart={(evt) => onTouchStartTextArea(evt, `${title.id}_wrap`)}
                            >
                                <StyledTextAreaButtonWrap id={`${title.id}_btnWrap`}>
                                    <StyledTextAreaDeleteButton onClick={() => { onClickDeleteButton('title') }}>
                                        <CloseOutlined />
                                    </StyledTextAreaDeleteButton>
                                    <StyledTextAreaDeleteButton onClick={() => { onClickCheckButton({ id: title.id, top: title.top, left: title.left }, 'title') }}>
                                        <CheckOutlined />
                                    </StyledTextAreaDeleteButton>
                                </StyledTextAreaButtonWrap>
                                <StyledTextArea
                                    value={titleText}
                                    data-gramm="false"
                                    data-gramm_editor="false"
                                    data-enable-grammarly="false"
                                    spellcheck="false"
                                    onKeyDown={(evt) => onKeyDownTextArea(evt, title.id, 'title')}
                                    onChange={(evt) => onChangeTextArea(evt, title.id, 'title')}
                                    onFocus={(evt) => onClickTextArea(evt, 'title', title.id)}
                                    id={title.id}
                                    width={title.width}
                                    height={title.fontSize ? title.fontSize : basicFontSize}
                                    fontColor={title.fontColor ? title.fontColor : basicFontColor}
                                    fontSize={title.fontSize ? title.fontSize : basicFontSize}
                                    fontStyle={title.fontStyle ? title.fontStyle : basicFontStyle}
                                /></StyledTextAreaWrap>
                        )
                    }
                </StyledCanvasContainer>
                <StyledBtnWrap onClick={onRightClick} className="rightBtnWrap"><CaretRightOutlined /></StyledBtnWrap>
                {
                    isShowPreview &&
                    <CreateStoryPagePreview
                        isShowPreview={isShowPreview}
                        setIsShowPreview={setIsShowPreview}
                    />
                }

            </StyledCanvasWrap>
        </StyledPageBodyWrap>
    )
}

export default CreateStoryPageBody;