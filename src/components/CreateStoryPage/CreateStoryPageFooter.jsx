import React,{useState,useRef,useCallback,useContext,useEffect} from 'react';
import styled from 'styled-components';
import {Row,Col, Button} from 'antd';
import {ItalicOutlined,FontColorsOutlined,FontSizeOutlined,UploadOutlined,PictureOutlined,SaveOutlined, WindowsFilled } from '@ant-design/icons';
import CreateStoryPageControllFontSize from './CreateStoryPageControllFontSize';
import CreateStoryPageSelectFontFamily from './CreateStoryPageSelectFontFamily';
import CreateStoryPageColorPicker from './CreateStoryPageColorPicker';
import {StoryPageContext,ENABLE_TYPE_TEXT,DISABLE_TYPE_TEXT, CHANGE_INPUTYPE} from '../../pages/CreatingStoryPage';

const StyledFooterWrap = styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    width:100%;height:12.5%;
    position:relative;
    @media screen and (max-height:420px){
        position:fixed;
        height:67.1px;
    }
`

const StyledFooter = styled.div`
    width:100%;
    height:90%;
    border-radius:10px;
    border:1px solid #454545;
    overflow:hidden;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    position:relative;
    background-color:rgba(45,45,45,0.5);
`;

const StyledBtnListWrap = styled(Row)`
    width:auto;
    height:80%;
    background-color:rgb(69, 69, 69);
    position:absolute; 
    padding:5.5px;
    border-radius:8.5px;
    .textTitle{
        display:${innerHeight<350?'none':'block'};
    }
`;

const StyledBtnWrap = styled(Col)`
    height:100%;
    width:70px;
`;

const StyledButton = styled(Button)`
    border-radius:5px;
    border:none;
    background-color:rgb(34, 34, 34);
    font-size:8.8px;
    height:100%;
    color:#fff;
    width:100%;
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
    align-items:center;

    &:hover{
        background-color:#454545;
        color:#fff;
    }
    &:focus{
        background-color:#b3afaf;
        color:#fff;
    }
    @media screen and (max-width:650px){
        font-size:5.5px;
    }
    .textTitle{
        display:${props=>props.innerheight<550?'none':'block'};
    }
    .iconTitle{
        font-size:13.8px;
        @media screen and (max-width:650px){
            font-size:8.5px;
        }
        @media screen and (max-height:450px){
            display:none;
        }
    }
`;

/* const initCanvas=(canvas)=>{
    canvas.width=768;canvas.height=1024;
    canvas.getContext('2d').fillStyle="fff";
    canvas.getContext('2d').fillRect(0,0,canvas.width,canvas.height);
} */

const canvasDataToBlob=(canvas)=>{
    const base64Data = canvas.toDataURL('image/png');
    const binaryData = window.atob(base64Data.split(',')[1]);
    const dataArr = new Array();
    for(let i = 0;i<binaryData.length;i++){
        dataArr.push(binaryData.charCodeAt(i));
    }
    let blob = new Blob([new Uint8Array(dataArr)],{type:'image/png'});
    return blob;
}

const CreateStoryPageFooter = ({setIsShowBookCoverList,setIsShowLoadBookCoverUpload,setIsShowPreview})=>{
    const [prevX,setPrevX]=useState(0);
    const [isTouched,setIsTouched]=useState(false);
    const footerRef = useRef(null);
    const btnListRef = useRef(null);
    const [showSelectFont,setShowSelectFont] = useState(false);
    const [showSelectColor,setShowSelectColor]=useState(false);
    const [showSelectFontSize,setSelectFontSize]=useState(false);
    const {initCanvas,drawCanvas,dispatch,inputType,basicFontStyle,basicFontSize,basicFontColor,author,title,storypage_cover}=useContext(StoryPageContext);
    const [innerHeight,setInnerHeight ]=useState(window.innerHeight);

    useEffect(()=>{
        const onResize = ()=>{
            setInnerHeight(window.innerHeight);
        }
        window.addEventListener('resize',onResize);
        return ()=>{
            window.removeEventListener("resize",onResize);
        }
    },[window.innerHeight])

    const onTouchStart=useCallback((e)=>{
        setPrevX(e.changedTouches[0].clientX);
        setIsTouched(true);
    },[])

    const onTouchMove= (e)=>{
        if(isTouched){
            e.stopPropagation();
            const offsetX = e.changedTouches[0].clientX;
            const diff = prevX-offsetX;
            let right = btnListRef.current.getBoundingClientRect().right;
            const footerRight = footerRef.current.getBoundingClientRect().right-0.25;
            right = footerRight-right;
            setPrevX(offsetX);
            btnListRef.current.style.right = `${right+diff}px`;
        }else{
            return false;
        }
    }

    const onTouchEnd=useCallback((e)=>{
        setIsTouched(false);
        setPrevX(-1);
    },[])

    const onMoveStart=useCallback((e)=>{
        setPrevX(e.clientX);
        setIsTouched(true);
    },[])

    const onMoveEnd=useCallback((e)=>{
        setIsTouched(false);
        setPrevX(-1);
    },[])

    const onMoveMove = useCallback((e)=>{
        if(isTouched){
            const offsetX = e.clientX;
            const diff = prevX-offsetX;
            let right = btnListRef.current.getBoundingClientRect().right;
            const footerRight = footerRef.current.getBoundingClientRect().right-0.25;
            right = footerRight-right;
            setPrevX(offsetX);
            btnListRef.current.style.right = `${right+diff}px`;
        }else{
            return false;
        }
    },[isTouched,prevX,btnListRef.current,footerRef.current])

    const onMouseLeave=useCallback((e)=>{
        setPrevX(-1);
        setIsTouched(false);
    },[])

    const onClickShowAll = useCallback((e)=>{
        setIsShowBookCoverList(prev=>!prev);
    },[])

    const onClickUploadButton = useCallback(()=>{
        setIsShowLoadBookCoverUpload(prev=>!prev);
    },[])

    const onSwitchInputType = useCallback(()=>{
        dispatch({type:CHANGE_INPUTYPE});
    },[])

    const onClickShowPreview = useCallback(()=>{
        setIsShowPreview(prev=>!prev);
    },[])

    const onClickSave = useCallback(async()=>{
        const tempCanvas= document.createElement('canvas');
        initCanvas(tempCanvas);
        await drawCanvas(tempCanvas,storypage_cover,title,author,basicFontStyle,basicFontSize,basicFontColor);
        const file = canvasDataToBlob(tempCanvas);
        const filename = `${Date.now()}.png`;
        if(window.showSaveFilePicker){
            const opts = {
                types:[{
                    accept:{'image/png':['.png']},
                }]
            }
            const fileHandle=  await window.showSaveFilePicker(opts);
            const fileStream = await fileHandle.createWritable();
            await fileStream.write(file);
            await fileStream.close();
        }else{
            const aTag = document.createElement('a');
            const fileURL = window.URL.createObjectURL(file);
            aTag.href = fileURL;
            aTag.download=filename;
            aTag.click();
            window.URL.revokeObjectURL(fileURL);
        }
    },[author,title,storypage_cover])

    return (
        <StyledFooterWrap>
            {showSelectFont&& <CreateStoryPageSelectFontFamily setShowSelectFont={setShowSelectFont}/>}
            {showSelectFontSize&&<CreateStoryPageControllFontSize setSelectFontSize={setSelectFontSize}/>}
            {showSelectColor&&<CreateStoryPageColorPicker setShowSelectColor={setShowSelectColor}/>}
            <StyledFooter ref={footerRef}>  
                <StyledBtnListWrap
                    ref={btnListRef}
                    onMouseUp={onMoveEnd}
                    onMouseMove={onMoveMove}
                    onMouseDown={onMoveStart}
                    onMouseLeave={onMouseLeave}
                    onTouchEnd={onTouchEnd}
                    onTouchMove={onTouchMove}
                    onTouchStart={onTouchStart}
                    gutter={[1.5,1.5]} 
                    wrap={false}
                >
                    <StyledBtnWrap span={1.5}>
                        <StyledButton onClick={onSwitchInputType}>
                            <span className="textTitle">{inputType==="title"?"Title":"Author"}</span>
                        </StyledButton>
                    </StyledBtnWrap>
                    {/* <StyledBtnWrap span={1.5}>
                        <StyledButton onClick={onClickText}>
                            <span className="textTitle">Text</span>
                            <span className="iconTitle"></span>
                        </StyledButton>
                    </StyledBtnWrap> */}
                    <StyledBtnWrap span={1.5} onClick={()=>{setSelectFontSize(prev=>!prev)}}>
                        <StyledButton innerheight={innerHeight}>
                            <span className="iconTitle"><FontSizeOutlined /></span>
                            <span className="textTitle">Font<br/>
                            Size</span>
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton innerheight={innerHeight} onClick={()=>{setShowSelectFont(prev=>!prev)}}>
                            <span className="iconTitle"><ItalicOutlined /></span>
                            <span className="textTitle">Font<br/>
                            Style</span>
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton innerheight={innerHeight} onClick={()=>{setShowSelectColor(prev=>!prev)}}>
                            <span className="iconTitle"><FontColorsOutlined style={{color:`${basicFontColor}`}}/></span>
                            <span className="textTitle">Font<br/>Color</span>
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton  innerheight={innerHeight} onClick={onClickUploadButton}>
                            <span className="iconTitle"><UploadOutlined /></span>
                            <span className="textTitle">Load<br/>
                            Image</span>
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton innerheight={innerHeight} onClick={onClickShowAll}>
                            <span className="iconTitle">Sample<br/>Cover</span>
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton innerheight={innerHeight} onClick={onClickShowPreview}>
                            <span className="iconTitle"><PictureOutlined /></span>
                            <span className="textTitle">Preview</span>
                        </StyledButton>
                    </StyledBtnWrap>
                    <StyledBtnWrap span={1.5}>
                        <StyledButton onClick={onClickSave}  innerheight={innerHeight}>
                            <span className="iconTitle"><SaveOutlined /></span>
                            <span className="textTitle">Save</span>
                        </StyledButton>
                    </StyledBtnWrap>
                </StyledBtnListWrap>
            </StyledFooter>
        </StyledFooterWrap>
    )

}

export default CreateStoryPageFooter;