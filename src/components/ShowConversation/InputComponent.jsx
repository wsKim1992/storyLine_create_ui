import React,{useState,useRef,useEffect, useCallback} from 'react';
import {Button,Row,Col,Input,Image} from 'antd';
import {SendOutlined,LeftCircleOutlined,RightCircleOutlined
,RedoOutlined,PictureOutlined,FileAddOutlined,SaveOutlined} from '@ant-design/icons';
import './conversationPage.css';
import {LOAD_STORY_REQUEST} from '../../../reducers/storyline';
import { useDispatch,useSelector } from 'react-redux';
//import ImageUpload from './ImageUpload';

const { Search } = Input;

const InputComponent = ()=>{
    const dispatch = useDispatch();
    const {loadingStory,loadedStory} = useSelector((state)=>state.storyline);
    const modeList = ['스토리','대화'];
    const modeMessage = ['What do you do?','What do you say?','What happens next?'];
    const [modeIdx,setModeIdx]=useState(0);
    const [message,setMessage] = useState('');
    const [inputType,setInputType] = useState('text');
    const searchRef = useRef(null);

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
        console.log(inputType);
        if(inputType==='text'){
            setMessage(e.target.value);
        }else{
            const file = e.target.files[0];
            if(file.type.match('image/*')){
                let fileReader = new FileReader();
                fileReader.onload = (evt)=>{
                    setMessage(evt.target.result);
                }
                fileReader.readAsDataURL(file);
            }else{
                alert("이미지 파일을 올려 주세요!");
                setMessage('');
            }
        }
    }

    const onSearch=(value)=>{
        if(message===''){return false;}
        dispatch({type:LOAD_STORY_REQUEST, data:{inputType:inputType==='file'?'image':'text',inputText:message}})
    }

    const changeInputType = ()=>{
        console.log(inputType);
        if(inputType==='text'){
            setInputType('file');
        }else{
            setInputType('text');
        }
    }

    return( 
        <React.Fragment>
            <div style={{borderRadius:'10px',border:'1px solid #454545',width:'100%',height:'39.5%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <Row justify="end" style={{width:'95%',height:'80%'}}>
                    <Col style={{height:'100%',marginLeft:'1px'}} span={1.5}>
                        <Button style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                            <RedoOutlined></RedoOutlined>
                            <p>RETRY</p>
                        </Button>
                    </Col>
                    <Col style={{height:'100%',marginLeft:'1px'}} span={1.5}>
                        <Button style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                            <SaveOutlined />
                            <p>SAVE</p>
                        </Button>
                    </Col>
                    <Col style={{height:'100%',marginLeft:'1px'}} span={1.5}>
                        <Button style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                            <FileAddOutlined/>
                            <p>OPEN</p>
                        </Button>
                    </Col>
                    {
                        modeList[modeIdx]==='스토리'&&
                        <Col style={{height:'100%',marginLeft:'1px'}} span={1.5}>
                            <Button onClick={changeInputType} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                                <label htmlFor={inputType==='file'?'searchComponent':null}>
                                    <PictureOutlined />
                                    <p>
                                        {
                                            inputType==='text'?
                                            'TO IMAGE MODE'
                                            :'UPLOAD IMAGE'
                                        }
                                    </p>
                                </label>
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
                        <Search
                            type={inputType}
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
                    </Col> 
                </Row>
            </div>
        </React.Fragment>
    )
}

export default InputComponent;