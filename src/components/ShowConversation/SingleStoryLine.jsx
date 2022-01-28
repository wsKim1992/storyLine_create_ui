import React,{useState,useCallback,useRef, useEffect} from 'react';
import {CHANGE_STORYLINE,LOAD_STORY_SUCCESS,LOAD_STORY_FAILURE,CHANGE_LAST_STORY_INDEX,CHANGE_LAST_STORY_INDEX_REQUEST} from '../../../reducers/storyline';
import PropTypes from 'prop-types';
import {Card,Image,Button, Row, Col} from 'antd';
import {SendOutlined,MessageOutlined,LeftCircleOutlined,RightCircleOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch,useSelector } from 'react-redux';

let StyledTextArea = styled.textarea`
    display:inline-block;
    background-color:rgb(34, 34, 34);
    color:#fff;
    width:100%;
    height:100%;
    border:none;
    border-radius:5.5px;
    overflow:hidden;
`;

const ChangeTextOutPutButtonWrap = styled.span`
    display:flex;
    flex-direction:row;
    align-items : center;
    justify-content:center;
    width : 35px;
    height : 23px;
`;
const ChangeTextOutPutButton = styled(Button)`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    border-radius:5.5px;
    border:none;
    background-color:#1890ff;
    color:#fff;
`;

const StyledCardComponent = styled(Card)`
    width:100%;
    height:auto;
    font-size:18.5px;
    color:#fff;
    font-size:22px;
    background-color:rgb(15, 15, 15);
    border:none;
    border-radius:7.5px;
    margin-bottom:10px;
`;

const InputStoryContextDiv = styled.div`
    width:100%;
    margin-bottom:5.5px;
    font-size:18.5px;
`;

const OutputStoryContextDiv = styled.div`
    user-select:none;
    position:relative;
    width:100%;
    height:100%;
    border-radius:10px;
    background-color:rgb(34, 34, 34);
    font-size:18.5px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
`;

const StyledImage= styled(Image)`
    width:200px;
    border-radius:10px;
`;

const InnerInputStoryContext=styled.div`
    display:flex;
    flex-direction:row;
    align-items:flex-end;
    justify-content:space-between;
`;

const SingleStoryLine=({data,isLastOne})=>{
    const outputTextRef = useRef(null);
    const textareaRef = useRef(null);
    const [outputHeight,setOutputHeight]=useState(null);
    const {creatingStory,newStoryLoading,loadingStory} = useSelector((state)=>state.storyline);
    const dispatch = useDispatch();
    const [visible,setVisible]=useState(false);
    const [editMode,setEditMode] = useState(false);
    const [outputText,setOutputText] = useState(isLastOne?data.outputText[creatingStory.index]:data.outputText);
    
    const onClickStyledImage=useCallback(()=>{
        setVisible(true);
    },[]);

    useEffect(()=>{
        if(!editMode){
            setOutputHeight(outputTextRef.current.getBoundingClientRect().height);
        }else{
            if(textareaRef.current){
                setOutputHeight(textareaRef.current.scrollHeight);
            }    
        }
    },[textareaRef.current?.scrollHeight]);

    useEffect(()=>{
        setOutputText(isLastOne?data.outputText[data.index]:data.outputText);
    },[isLastOne?data.index:data.outputText,data]);

    const onClickRedo = isLastOne? useCallback(()=>{
        dispatch({type:CHANGE_LAST_STORY_INDEX,direction:'forth'});    
    },[]):null;

    const onClickUndo =  isLastOne? useCallback(()=>{
        dispatch({type:CHANGE_LAST_STORY_INDEX,direction:'back'});
    },[]):null;

    const onClickOutputText = useCallback(()=>{
        if(isLastOne&&loadingStory){
            return false;
        }
        if(!editMode){
            setEditMode(true);
        }
    },[editMode,loadingStory,isLastOne]);

    const onEditOutput = useCallback(()=>{
        const dataToSend = isLastOne?{id:data.id,outputText,flag:true}:{id:data.id,outputText};
        dispatch({type:CHANGE_STORYLINE,data:dataToSend});
        setEditMode(false);
    },[outputText,isLastOne]);

    const onChangeOutputText = (evt)=>{
        setOutputText(evt.target.value);
    };

    return(
        <React.Fragment>
            <StyledCardComponent>
                {
                    data.inputType==='text'
                    &&
                    <InputStoryContextDiv style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <Row style={{width:'100%',height:'auto'}}>
                            <Col span={(isLastOne?(editMode?23:20):23)}>
                                {data.inputText&&
                                <span>
                                    <MessageOutlined/>&nbsp;       
                                    {Array.isArray(data.inputText)?(<><p>{data.inputText[0]}</p><p>{data.inputText[1]}</p></>):data.inputText}
                                </span>}
                            </Col>
                            <Col style={{ display: 'flex',flexDirection: 'column-reverse'}} span={(isLastOne?(editMode?1:4):1)}>
                                {
                                    !editMode
                                    &&
                                    isLastOne
                                    &&
                                    (
                                        <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',width:'auto'}}>
                                            <span>
                                                {creatingStory.outputText&&`${creatingStory.index+1}/${creatingStory.outputText.length}`}
                                            </span>
                                            <span>
                                                <Button onClick={onClickUndo} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff',marginLeft:'2.5px'}}>
                                                    <LeftCircleOutlined></LeftCircleOutlined>
                                                </Button>
                                                <Button onClick={onClickRedo} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                                                    <RightCircleOutlined></RightCircleOutlined>
                                                </Button>
                                            </span>
                                        </div >
                                    )
                                }
                                {
                                    editMode&&
                                    <ChangeTextOutPutButtonWrap >
                                        <ChangeTextOutPutButton onClick={onEditOutput}><SendOutlined /></ChangeTextOutPutButton>  
                                    </ChangeTextOutPutButtonWrap>
                                }
                            </Col>
                        </Row>
                    </InputStoryContextDiv>
                }
                {
                    data.inputType==='image'
                    &&
                    <InputStoryContextDiv>
                        <div>
                            <MessageOutlined/>
                        </div>
                        <InnerInputStoryContext>
                            <StyledImage 
                                preview={{visible:false}} 
                                width={200}
                                src={data.inputText}
                                onClick={onClickStyledImage}
                            />
                            {
                                !editMode
                                &&
                                isLastOne
                                &&
                                <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'auto'}}>
                                    <span>
                                        {creatingStory.outputText&&`${creatingStory.index+1}/${creatingStory.outputText.length}`}
                                    </span>
                                    <span>
                                        <Button onClick={onClickUndo} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff',marginRight:'2.5px'}}>
                                            <LeftCircleOutlined></LeftCircleOutlined>
                                        </Button>
                                        <Button onClick={onClickRedo} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                                            <RightCircleOutlined></RightCircleOutlined>
                                        </Button>
                                    </span>
                                </div>
                            }
                            {
                                editMode&&
                                <ChangeTextOutPutButtonWrap>
                                    <ChangeTextOutPutButton onClick={onEditOutput}><SendOutlined /></ChangeTextOutPutButton>  
                                </ChangeTextOutPutButtonWrap>
                            }
                        </InnerInputStoryContext>
                        <div style={{display:'none'}}>
                            <Image.PreviewGroup preview={{visible,onVisibleChange:vis=>setVisible(false)}}>
                                <Image src={data.inputText} />
                            </Image.PreviewGroup>
                        </div>
                    </InputStoryContextDiv>
                }
                
                <OutputStoryContextDiv ref={outputTextRef} onClick={onClickOutputText}>
                    {isLastOne&&(loadingStory||newStoryLoading)
                        &&
                        (<OutputStoryContextDiv style={{width:'100%',backgroundColor:'#454545',position:'absolute',opacity:'0.55'}}>
                            <Image preview={false} width={100} height={100} src={"/assets/img/loading2.gif"}/>
                        </OutputStoryContextDiv>)
                    }
                    {!editMode?
                        (outputText)
                        :(
                            <>
                                <StyledTextArea ref={textareaRef} style={{height:`${outputHeight}px`}} onChange={onChangeOutputText} value={outputText}/>
                            </>
                        ) 
                    }
                </OutputStoryContextDiv>
                
            </StyledCardComponent>
        </React.Fragment>
    )
}

SingleStoryLine.propTypes={
    data:PropTypes.shape({
        inputType:PropTypes.oneOfType([PropTypes.string.isRequired,PropTypes.number.isRequired]),
        inputText:PropTypes.oneOfType[PropTypes.string.isRequired,PropTypes.arrayOf(PropTypes.string)],
        outputText:PropTypes.oneOfType[PropTypes.string.isRequired,PropTypes.arrayOf(PropTypes.string)]
    }),
    isLastOne:PropTypes.bool.isRequired
}

export default SingleStoryLine;