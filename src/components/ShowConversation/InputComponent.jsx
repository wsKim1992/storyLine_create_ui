import React,{useState,useCallback, useEffect} from 'react';
import {Button,Row,Col,Input,Image} from 'antd';
import {SendOutlined,LeftCircleOutlined,RightCircleOutlined
,RedoOutlined,PictureOutlined,FileAddOutlined,SaveOutlined} from '@ant-design/icons';
import './conversationPage.css';
import {LOAD_STORY_REQUEST} from '../../../reducers/storyline';
import { useDispatch,useSelector } from 'react-redux';
import ImageUpload from './ImageUpload';

const { Search } = Input;

const InputComponent = ()=>{
    const dispatch = useDispatch();
    const {loadingStory} = useSelector((state)=>state.storyline);
    const modeList = ['Do','Say','image'];
    const modeMessage = ['What do you do?','What do you say?','What happens next?'];
    const [modeIdx,setModeIdx]=useState(0);
    const [message,setMessage] = useState('');

    const changeMode=(e)=>{
        if(modeIdx===2)setModeIdx(0);
        else setModeIdx(prevModeIdx=>prevModeIdx+1);
        setMessage('');
    }

    const onChangeMessage = (e)=>{
        setMessage(e.target.value);
    }

    const onSearch=(value)=>{
        if(message===''||(Array.isArray(message)&&message.length===0)){return false;}
        dispatch({type:LOAD_STORY_REQUEST, data:{inputType:modeList[modeIdx]==='image'?'image':'text',inputText:message}})
        setTimeout(()=>{
            Array.isArray(message)?setMessage([]):setMessage('');
        },0);
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
                    <Col style={{height:'100%',marginLeft:'1px'}} span={1.5}>
                        <Button style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                            <label htmlFor={modeList[modeIdx]==='image'?'imageInput':null}>
                                <PictureOutlined />
                                <p>UPLOAD IMAGE</p>
                            </label>
                        </Button>
                    </Col>
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
                            modeList[modeIdx]!=='image'
                            ?
                            <Search
                                type="text"
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
                            :(
                                <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%',height:'100px'}}>
                                    <ImageUpload message={message} setMessage={setMessage} onSearch={onSearch}/>
                                </div>
                            )
                        }
                    </Col> 
                </Row>
            </div>
        </React.Fragment>
    )
}

export default InputComponent;