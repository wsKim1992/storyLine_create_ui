import React,{useState,useRef,useMemo,useEffect, useCallback} from 'react';
import {Button,Row,Col,Input,Image} from 'antd';
import {SendOutlined,CloseOutlined,FilePdfOutlined,LeftCircleOutlined,RightCircleOutlined,StepForwardOutlined
,RedoOutlined,PictureOutlined,FileAddOutlined,SaveOutlined,AudioOutlined,MenuOutlined, FormOutlined} from '@ant-design/icons';
import './conversationPage.css';
import {LOAD_SAMPLE_DATA,INIT_REQUEST,LOAD_STORY_REQUEST,ENCODE_AND_SAVE_REQUEST,ENCODE_AND_SAVE_INIT,DECODE_AND_UPLOAD_REQUEST, CHANGE_LAST_STORY_INDEX_REQUEST, SHOW_ENTIRE_STORY, EDIT_ENTIRE_STORY} from '../../../reducers/storyline';
import {CHANGE_GENRE} from '../../../reducers/storyData';
import { useDispatch,useSelector } from 'react-redux';
import ImageUpload from './ImageUpload';
import RecordComponent from './RecordComponent';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const { Search } = Input;

const StyledEntireWrap = styled.div`
    overflow:hidden;
    position:relative;
    border-radius:10px;
    border:1px solid #454545;
    width:100%;
    height:47.5%;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
`;

const StyledMouseDiv = styled.div`
    position:absolute;
    width:50px;
    height:50px;
    z-index:10;
    top:0px;
    left:0px;
    margin:-25px -25px;
`;

const StyledCol=styled(Col)`
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
    p{
        text-align:center;
    }
    &:hover{
        background-color:#454545;
        color:#fff;
    }
    &:focus{
        background-color:rgb(34, 34, 34);
        color:#fff;
    }
`;

const StyledDiv = styled.div`
    position:relative;
    border:1px solid #454545;
    width:100%;
    height:auto;
    padding: 10px 0;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    cursor:url(./assets/img/EkhxNgXUUAEyO__.jpg),auto;
    border-radius: 10px;
`

const InputComponent = ({message,setMessage,isSpeak,setIsSpeak,setShowInPDF})=>{
    const dispatch = useDispatch();
    const {editEntireStory,encodedStoryLine,loadingStory,loadedStory,newStoryLoading,createdStory,creatingStory,encodeAndSaveLoaded,encodeAndSaveLoading,showEntireStory} = useSelector((state)=>state.storyline);
    const {movieType}=useSelector(state=>state.storyData.storyData);
    const modeList = ['스토리','대화'];
    const modeMessage = ['스토리 생성에 필요한 입력을 넣어주세요!','대화생성을 위한 입력을 넣어 주세요!','What happens next?'];
    const [modeIdx,setModeIdx]=useState(0);
    //const [message,setMessage] = useState('');
    const [inputType,setInputType] = useState('text');
    const genreList = ['일반','로맨스','판타지','미스테리','무협'];
    const [genreIndex,setGenreIndex] = useState(0);
    const btnListWrapRef = useRef(null);
    const btnListRef = useRef(null);
    const [isClickedBtnList , setIsClickedBtnList]=useState(false);
    const [prevBtnListPointerX,setPrevBtnListPointerX]=useState(-1);
    const mouseComponentRef=useRef(null);
    const inputComponentRef=useRef(null);

    const onClickGenre = useCallback(()=>{
        if(genreIndex===genreList.length-1){
            setGenreIndex(0);
        }else{
            setGenreIndex(prevVal=>prevVal+1);
        }
    },[genreIndex])

    const diableInput=useMemo(()=>{
        return showEntireStory||loadingStory;
    },[showEntireStory,loadingStory])

    const saveFile = async(encodedText)=>{
        const blob = new Blob([encodedText],{type:'text/plain'});
        const fileName = `${Date.now()}.pkg`;
        if(window.showSaveFilePicker){
            const opts = {
                types: [{
                  description: 'Text file',
                  accept: {'pkg': ['.pkg']},
                }],
              };
            const fileHandle = await window.showSaveFilePicker(opts);
            const fileStream = await fileHandle.createWritable();
            await fileStream.write(blob);
            await fileStream.close();
        }else{
            const fileURL = window.URL.createObjectURL(blob);
            const aTag = document.createElement('a');
            aTag.href = fileURL
            aTag.download = fileName;
            aTag.click();
            window.URL.revokeObjectURL(fileURL);
        }
    }
   
    useEffect(()=>{
        const index = genreList.findIndex((ele)=>ele===movieType)
        setGenreIndex(index===-1?0:index); 
    },[])

    useEffect(()=>{
        dispatch({type:CHANGE_GENRE,data:genreList[genreList]});
    },[genreIndex])

    useEffect(()=>{
        if(encodeAndSaveLoaded&&!encodeAndSaveLoading){
            saveFile(encodedStoryLine);
            dispatch({type:ENCODE_AND_SAVE_INIT});
        }
    },[encodeAndSaveLoaded,encodeAndSaveLoading])

    useEffect(()=>{
        if(!loadingStory&&loadedStory){
            setMessage('');
        }
    },[loadingStory,loadedStory])

    const changeMode=(e)=>{
        if(modeIdx>=modeList.length-1){
            setModeIdx(0);
        }else{
            setModeIdx(prevModeIdx=>prevModeIdx+1);
        } 
        setInputType('text');
        setMessage('');
    }

    const onChangeMessage = (e)=>{
        setMessage(e.target.value);
    }

    const onSearch=(value)=>{
        if(message===''){return false;}
        const storyMode = modeList[modeIdx]==='스토리'?'story':'talk';
        dispatch({type:LOAD_STORY_REQUEST, data:{genre:genreList[genreIndex],storyMode,inputType:inputType==='image'?'image':'text',inputText:message,isInputEqualsOutput:false}});
    }

    const changeInputType = (e)=>{
        e.stopPropagation();
        if(inputType==='text'){
            setInputType('image');
        }else{
            setInputType('text');
        }
        setMessage('');
    }

    const onClickSave = ()=>{
        if(!creatingStory||createdStory.length===0){
            alert('스토리를 생성 해주세요!');
            return false;
        }
        if(creatingStory){
            dispatch({type:ENCODE_AND_SAVE_REQUEST,data:[...createdStory,{...creatingStory,outputText:creatingStory.outputText[creatingStory.index]}]});
        }else{
            dispatch({type:ENCODE_AND_SAVE_REQUEST,data:[...createdStory]});
        }
    }

    const onClickUpload = (evt)=>{
        const file = evt.target.files[0];
        const fileType = file.name.split('.')[1]
        if(fileType==='pkg'){
            let reader = new FileReader();
            reader.onload=(readerEvt)=>{
                const textData = readerEvt.target.result;
                dispatch({type:DECODE_AND_UPLOAD_REQUEST,textData});
            }
            reader.readAsText(file,'base64');
        }else{
            alert(".pkg 형식의 파일을 업로드 해주세요!");
            return false;
        }
    }

    const onClickRetry = useCallback(()=>{
        if(!creatingStory)return false;
        const inputData={inputType:creatingStory.inputText?inputType:'text',genre:genreList[genreIndex],inputText:creatingStory.inputText?creatingStory.inputText:createdStory[createdStory.length-1].outputText,storyMode:creatingStory.storyMode};
        dispatch({type:CHANGE_LAST_STORY_INDEX_REQUEST,data:inputData});
    },[creatingStory,createdStory]);

    const onClickSpeak = useCallback(()=>{
        if(!isSpeak){
            setMessage('');
            setIsSpeak(true);
        }else{
            setIsSpeak(false);
        }
    },[isSpeak])

    const onClickShowEntire = useCallback(()=>{
        if(!editEntireStory){
            btnListRef.current.style.right=`0px`;
        }
        if(createdStory.length===0&&creatingStory===null){
            alert("스토리를 생성해 주세요!");
            return false;
        }
        dispatch({type:SHOW_ENTIRE_STORY});
    },[createdStory,creatingStory,editEntireStory]);

    const onClickNext = useCallback(()=>{
        const storyMode = modeList[modeIdx]==='스토리'?'story':'talk';
        const inputText= creatingStory.outputText[creatingStory.index];
        const data = {genre:genreList[genreIndex],storyMode,inputType:'text',inputText,isInputEqualsOutput:true};
        dispatch({type:LOAD_STORY_REQUEST, data});
    },[modeIdx,creatingStory,genreIndex,inputType]);

    const onClickWrapRef=(e)=>{
        e.stopPropagation();
        const {left} = btnListRef.current.getBoundingClientRect();
        
        const offsetX= e.clientX;
        setIsClickedBtnList(true);
        setPrevBtnListPointerX(offsetX);
        
    }

    const onMouseMove=(e)=>{
        if(isClickedBtnList){
            const offsetX=e.clientX;
            const right = parseFloat(btnListRef.current.style.right.split('px')[0]);
            const diff = prevBtnListPointerX-offsetX;
            if(btnListRef.current.getBoundingClientRect().width+(diff+right)<=btnListWrapRef.current.getBoundingClientRect().width){
                btnListRef.current.style.right = `${right}px`;
                return false;    
            }else if(btnListRef.current.getBoundingClientRect().width+(btnListRef.current.getBoundingClientRect().x-diff)<=btnListWrapRef.current.getBoundingClientRect().width){
                btnListRef.current.style.right = `0px`;
                return false;
            }
            btnListRef.current.style.right = `${right+diff}px`;
        }else{
            return false;
        }
    }

    const onMouseUp = useCallback((e)=>{
        setPrevBtnListPointerX(-1);
        setIsClickedBtnList(false);
    },[])

    const onMouseOut=useCallback((e)=>{
        setPrevBtnListPointerX(-1);
        setIsClickedBtnList(false);
    },[])

    const onTouchStart=(e)=>{
        const offsetX= e.changedTouches[0].clientX;
        setIsClickedBtnList(true);
        setPrevBtnListPointerX(offsetX);
    }

    const onTouchMove=(e)=>{
        if(isClickedBtnList){
            const offsetX=e.changedTouches[0].clientX;
            const right = parseFloat(btnListRef.current.style.right.split('px')[0]);
            const diff = prevBtnListPointerX-offsetX;
            setPrevBtnListPointerX(offsetX);
            if(btnListRef.current.getBoundingClientRect().width+(diff+right)<=btnListWrapRef.current.getBoundingClientRect().width-20){
                btnListRef.current.style.right = `${right}px`;
                return false;    
            }else if(btnListRef.current.getBoundingClientRect().width+(btnListRef.current.getBoundingClientRect().x-diff)<=btnListWrapRef.current.getBoundingClientRect().width){
                btnListRef.current.style.right = `0px`;
                return false;
            }
            btnListRef.current.style.right = `${right+diff}px`;
        }else{
            return false;
        }
    }

    const onTouchEnd = useCallback((e)=>{
        setPrevBtnListPointerX(-1);
        setIsClickedBtnList(false);
    },[]);

    const onClickReset = useCallback(()=>{
        dispatch({type:INIT_REQUEST});
    },[]);

    const onClickPDF = useCallback(()=>{
        setShowInPDF(prev=>!prev);
    },[])

    const onMouseEnterDiv = (e)=>{
        inputComponentRef.current.style.cursor='none';
        const x = inputComponentRef.current.getBoundingClientRect().x;
        const y = inputComponentRef.current.getBoundingClientRect().y;
        const offsetX = e.clientX;
        const offsetY = e.clientY;
        mouseComponentRef.current.style.top=`${offsetY-y}px`;
        mouseComponentRef.current.style.left=`${offsetX-x}px`;
    }

    const onMouseMoveDiv = (e)=>{
        const x = inputComponentRef.current.getBoundingClientRect().x;
        const y = inputComponentRef.current.getBoundingClientRect().y;
        const offsetX = e.clientX;
        const offsetY = e.clientY;
        mouseComponentRef.current.style.top=`${offsetY-y}px`;
        mouseComponentRef.current.style.left=`${offsetX-x}px`;
    }
    
    const onMouseLeaveDiv=(e)=>{
        //mouseComponentRef.current.style.cursor='default';
    }

    const onClickLoadSampleData = useCallback(()=>{
        dispatch({type:LOAD_SAMPLE_DATA});
    },[]); 

    return( 
        <React.Fragment>
            <StyledEntireWrap ref={btnListWrapRef} >
                <Row onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} onMouseOut={onMouseOut} onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseDown={onClickWrapRef} ref={btnListRef} gutter={[1.5,1.5]} wrap={false} justify="end" style={{position:'absolute',right:'0',overflow:'hidden',width:'641px',height:'80%',padding:'5.5px 5.5px'}}>
                    {showEntireStory&&
                    <StyledCol span={1.5}>
                        <StyledButton onClick={onClickPDF}>
                            <FilePdfOutlined /> 
                            <p>PDF로 <br/>변환</p>
                        </StyledButton>
                    </StyledCol>
                    }
                    {!showEntireStory&&
                    <StyledCol span={1.5}>
                        <StyledButton onClick={onClickReset} >
                            <FormOutlined />
                            <p>새로쓰기</p>
                        </StyledButton>
                    </StyledCol>
                    }
                    {!showEntireStory&&
                    <StyledCol span={1.5}>
                        <StyledButton onClick={onClickLoadSampleData}>
                            <FormOutlined />
                            <p>샘플보기</p>
                        </StyledButton>
                    </StyledCol>
                    }
                    {!showEntireStory&&
                    <StyledCol span={1.5}>
                        <StyledButton onClick={onClickSpeak}>
                            <AudioOutlined />
                            <p>VOICE</p>
                        </StyledButton>
                    </StyledCol>
                    }
                    <StyledCol span={1.5}>
                        <StyledButton onClick={onClickShowEntire}>
                            {showEntireStory?<CloseOutlined />:<MenuOutlined />}
                            <p>{showEntireStory?
                                'CLOSE':
                                'VIEW'}
                            </p>
                        </StyledButton>
                    </StyledCol>
                    {!showEntireStory&&
                    <StyledCol span={1.5}>
                        <StyledButton onClick={onClickNext}>
                            <StepForwardOutlined />
                            <p>NEXT</p>
                        </StyledButton>
                    </StyledCol>
                    }
                    {!showEntireStory&&
                    <StyledCol span={1.5}>
                        <StyledButton onClick={onClickGenre}>
                            <p style={{marginBottom:'0px'}}>장르</p>
                            <p>{genreList[genreIndex]}</p>
                        </StyledButton>
                    </StyledCol>
                    }
                    {!showEntireStory&&
                    <StyledCol span={1.5}>
                        <StyledButton onClick={onClickRetry} >
                            <RedoOutlined></RedoOutlined>
                            <p>RETRY</p>
                        </StyledButton>
                    </StyledCol>
                    }
                    {!showEntireStory&&
                    <StyledCol span={1.5}>
                        <StyledButton onClick={onClickSave} >
                            <SaveOutlined />
                            <p>SAVE</p>
                        </StyledButton>
                    </StyledCol>
                    }
                    {!showEntireStory&&
                    <StyledCol span={1.5}>
                        <input id="readNSTFile" onChange={onClickUpload} type="file" style={{display:'none'}}/>
                        <StyledButton>
                            <label htmlFor={"readNSTFile"}>
                                <FileAddOutlined/>
                                <p>OPEN</p>
                            </label>
                        </StyledButton>
                    </StyledCol>
                    }
                    {
                        !showEntireStory&&
                        modeList[modeIdx]==='스토리'&&
                        <StyledCol span={1.5}>
                            <StyledButton onClick={changeInputType}>
                                <PictureOutlined />
                                <p>
                                    {
                                        inputType==='image'?
                                        'TEXT':'IMAGE'
                                    }
                                    </p>
                            </StyledButton>
                        </StyledCol>
                    }
                </Row>
            </StyledEntireWrap>
            <StyledDiv ref={inputComponentRef} 
                onMouseLeave={(newStoryLoading||loadingStory)?onMouseLeaveDiv:null} 
                onMouseEnter={(newStoryLoading||loadingStory)?onMouseEnterDiv:null} 
                onMouseMove={(newStoryLoading||loadingStory)?onMouseMoveDiv:null}>
                {(newStoryLoading||loadingStory)&&<StyledMouseDiv ref={mouseComponentRef}>
                    <Image preview={false} src={"/assets/img/loading5.gif"} width={"100%"} height={"100%"}/>
                </StyledMouseDiv>}
                <Row gutter={1.5} style={{width:'95%',height:'65%',display:'flex',flexDirection:'row',verticalAlign:'center'}}>
                    <Col span={4}>
                        <Button disabled={diableInput} style={{fontSize:'10.5px',backgroundColor:'rgba(35, 156, 158, 0.75)',width:'100%',height:'100%',borderRadius:'5px',border:'none'}} onClick={changeMode} type="primary">
                            {modeList[modeIdx]}
                        </Button>    
                    </Col>
                    <Col span={20}>
                        {
                            inputType==='text'?
                            (
                                <Search
                                    type='text'
                                    style={{color:'#454545'}}
                                    id="searchComponent"
                                    placeholder={modeMessage[modeIdx]}
                                    allowClear
                                    enterButton={<SendOutlined/>}
                                    size="large"
                                    onChange={onChangeMessage}
                                    onSearch={onSearch}
                                    loading={loadingStory}
                                    value={message}
                                    disabled={diableInput}
                                />
                            )
                            :
                            (
                                <ImageUpload inputType={inputType} message={message} setMessage={setMessage} onSearch={onSearch}/>
                            )
                        }
                    </Col> 
                </Row>
                {
                    isSpeak&&
                    <RecordComponent setMessage={setMessage} setIsSpeak={setIsSpeak}/>
                }
            </StyledDiv>
        </React.Fragment>
    )
}

export default InputComponent;