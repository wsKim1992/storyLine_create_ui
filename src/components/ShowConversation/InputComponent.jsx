import React,{useState,useRef,useEffect, useCallback} from 'react';
import {Button,Row,Col,Input,Image} from 'antd';
import {SendOutlined,LeftCircleOutlined,RightCircleOutlined
,RedoOutlined,PictureOutlined,FileAddOutlined,SaveOutlined} from '@ant-design/icons';
import './conversationPage.css';
import {LOAD_STORY_REQUEST,ENCODE_AND_SAVE_REQUEST,ENCODE_AND_SAVE_INIT,DECODE_AND_UPLOAD_REQUEST, CHANGE_LAST_STORY_INDEX_REQUEST} from '../../../reducers/storyline';
import { useDispatch,useSelector } from 'react-redux';
import ImageUpload from './ImageUpload';

const { Search } = Input;

const InputComponent = ()=>{
    const dispatch = useDispatch();
    const {encodedStoryLine,loadingStory,loadedStory,createdStory,creatingStory,encodeAndSaveLoaded,encodeAndSaveLoading} = useSelector((state)=>state.storyline);
    const modeList = ['스토리','대화'];
    const modeMessage = ['What do you do?','What do you say?','What happens next?'];
    const [modeIdx,setModeIdx]=useState(0);
    const [message,setMessage] = useState('');
    const [inputType,setInputType] = useState('text');

    const saveFile = (encodedText)=>{
        const blob = new Blob([encodedText],{type:'text/plain'});
        const fileName = `${Date.now()}.nst`;
        const aTag = document.createElement('a');
        const fileURL = window.URL.createObjectURL(blob);
        aTag.href = fileURL
        aTag.download = fileName;
        aTag.click();
        console.log(fileURL);
        window.URL.revokeObjectURL(fileURL);
    }

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
        console.log("onChangeMessage");
        setMessage(e.target.value);
    }

    const onSearch=(value)=>{
        if(message===''){return false;}
        const storyMode = modeList[modeIdx]==='스토리'?'story':'talk';
        dispatch({type:LOAD_STORY_REQUEST, data:{storyMode,inputType:inputType==='file'?'image':'text',inputText:message}});
    }

    const changeInputType = (e)=>{
        e.stopPropagation();
        if(inputType==='text'){
            setInputType('file');
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
        if(fileType==='nst'){
            let reader = new FileReader();
            reader.onload=(readerEvt)=>{
                const textData = readerEvt.target.result;
                dispatch({type:DECODE_AND_UPLOAD_REQUEST,textData});
            }
            reader.readAsText(file,'base64');
        }else{
            alert(".nst 형식의 파일을 업로드 해주세요!");
            return false;
        }
    }

    const onClickRetry = useCallback(()=>{
        const inputData={inputText:creatingStory.inputText,storyMode:creatingStory.storyMode};
        dispatch({type:CHANGE_LAST_STORY_INDEX_REQUEST,data:inputData});
    },[creatingStory]);

    return( 
        <React.Fragment>
            <div style={{borderRadius:'10px',border:'1px solid #454545',width:'100%',height:'39.5%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <Row justify="end" style={{width:'90%',height:'80%',marginRight:'28px',padding:'0 25px'}}>
                    <Col style={{height:'100%',marginLeft:'1px'}} span={1.5}>
                        <Button onClick={onClickRetry} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                            <RedoOutlined></RedoOutlined>
                            <p>RETRY</p>
                        </Button>
                    </Col>
                    <Col style={{height:'100%',marginLeft:'1px'}} span={1.5}>
                        <input style={{display:"none"}} type="file" id="savePath" webkitdirectory/>
                        <Button onClick={onClickSave} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                            <SaveOutlined />
                            <p>SAVE</p>
                        </Button>
                    </Col>
                    <Col style={{height:'100%',marginLeft:'1px'}} span={1.5}>
                        <input id="readNSTFile" onChange={onClickUpload} type="file" style={{display:'none'}}/>
                        <Button style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                            <label htmlFor={"readNSTFile"}>
                                <FileAddOutlined/>
                                <p>OPEN</p>
                            </label>
                        </Button>
                    </Col>
                    {
                        modeList[modeIdx]==='스토리'&&
                        <Col style={{height:'100%',marginLeft:'1px'}} span={1.5}>
                            <Button onClick={changeInputType} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                                
                                    <PictureOutlined />
                                    <p>
                                        {
                                            inputType==='file'?
                                            'TEXT':'IMAGE'
                                        }
                                    </p>
                                
                            </Button>
                        </Col>
                    }
                </Row>
            </div>
            <div id="inputComponent" style={{borderRadius:'10px',border:'1px solid #454545',width:'100%',height:'auto',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                
                <Row gutter={1.5} style={{width:'95%',height:'auto',display:'flex',flexDirection:'row',verticalAlign:'center',padding:'10px 0'}}>
                    <Col span={4}>
                        <Button style={{backgroundColor:'rgba(35, 156, 158, 0.75)',width:'100%',height:'100%',borderRadius:'5px',border:'none'}} size="large" onClick={changeMode} type="primary">
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
                                    enterButton={<SendOutlined />}
                                    size="large"
                                    onChange={onChangeMessage}
                                    onSearch={onSearch}
                                    loading={loadingStory}
                                />
                            )
                            :
                            (
                                <ImageUpload message={message} setMessage={setMessage} onSearch={onSearch}/>
                            )
                        }
                    </Col> 
                </Row>
            </div>
        </React.Fragment>
    )
}

export default InputComponent;