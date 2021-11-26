import React,{useState,useCallback} from 'react';
import {LOAD_STORY_REQUEST,LOAD_STORY_SUCCESS,LOAD_STORY_FAILURE,CHANGE_LAST_STORY_INDEX} from '../../../reducers/storyline';
import PropTypes from 'prop-types';
import {Layout,Badge,Card,Image,Button} from 'antd';
import {MessageOutlined,LeftCircleOutlined,RightCircleOutlined} from '@ant-design/icons'
import styled from 'styled-components';
import { useDispatch,useSelector } from 'react-redux';

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
    width:100%;
    border-radius:10px;
    background-color:rgb(34, 34, 34);
    font-size:18.5px;
`;

const StyledImage= styled(Image)`
    width:200px;
    border-radius:10px;
`

const InnerInputStoryContext=styled.div`
    display:flex;
    flex-direction:row;
    align-items:flex-end;
    justify-content:space-between;
`;

const SingleStoryLine=({data,isLastOne})=>{
    const {creatingStory} = useSelector((state)=>state.storyline);
    const dispatch = useDispatch();

    const [visible,setVisible]=useState(false);
    const onClickStyledImage=useCallback(()=>{
        setVisible(true);
    },[])

    const onClickUndo = useCallback(()=>{
        console.log('undo');
        dispatch({type:CHANGE_LAST_STORY_INDEX,direction:'forth'});
    },[])

    const onClickRedo = useCallback(()=>{
        console.log('redo');
        dispatch({type:CHANGE_LAST_STORY_INDEX,direction:'back'});
    },[])

    return(
        <React.Fragment>
            <StyledCardComponent>
                {
                    data.inputType==='text'
                    &&
                    <InputStoryContextDiv style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <span>
                            <MessageOutlined/>&nbsp;   
                            {data.inputText}
                        </span>
                        {
                            isLastOne
                            &&
                            <span>
                                <Button onClick={onClickUndo} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff',marginLeft:'2.5px'}}>
                                    <LeftCircleOutlined></LeftCircleOutlined>
                                </Button>
                                <Button onClick={onClickRedo} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                                    <RightCircleOutlined></RightCircleOutlined>
                                </Button>
                            </span>
                        }
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
                                src={data.inputText[0]}
                                onClick={onClickStyledImage}
                            />
                            {isLastOne&&
                            <div>
                                <Button onClick={onClickUndo} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff',marginRight:'2.5px'}}>
                                    <LeftCircleOutlined></LeftCircleOutlined>
                                </Button>
                                <Button onClick={onClickRedo} style={{borderRadius:'5px',border:'none',backgroundColor:'rgb(34, 34, 34)',fontSize:'13.5px',height:'100%',color:'#fff'}}>
                                    <RightCircleOutlined></RightCircleOutlined>
                                </Button>
                            </div>}
                        </InnerInputStoryContext>
                        <div style={{display:'none'}}>
                            <Image.PreviewGroup preview={{visible,onVisibleChange:vis=>setVisible(false)}}>
                                {
                                    data.inputText.map((v,i)=>(
                                        <Image key={i} src={v}/>
                                    ))
                                }
                            </Image.PreviewGroup>
                        </div>
                        
                    </InputStoryContextDiv>
                }
                <OutputStoryContextDiv>

                    {isLastOne?data.outputText[creatingStory.index]:data.outputText}
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