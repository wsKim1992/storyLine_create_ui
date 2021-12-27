import React,{useState,useCallback,useRef} from 'react';
import {Layout,Form,Input,Button,Radio,Image,Col,Row} from 'antd';
import {LeftOutlined,RightOutlined} from '@ant-design/icons'
import styled from 'styled-components';
import faker from 'faker';
import {useNavigate} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import { STORYDATA_LOAD_REQUEST } from '../../reducers/storyData';
import { useEffect } from 'react';
import CoverComponent from '../components/ShowConversation/CoverComponent';

const {Header,Footer,Sider,Content} = Layout;

const EntireWrap = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`

const StyledHeader = styled(Header)`
    height:7.5%;
    display:flex;
    flex-direction:column;
    align-items:center;
    font-size:70%;
    h1{
        height:100%;
        color:#fff;
    }
`

const StyledLayout = styled(Layout)`
    height:100%;
    width: 66.7%;
    @media screen and (max-width:768px){
        width:100%;
    }
`

const StyledContent = styled(Content)`
    width:100%;
    height:100%;
    background-color:#000;
`;

const StyledForm =styled(Form)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: 91.5%;
    overflow-y:auto;
    position:relative;
    .sub_component_container{
        width:80%;height:100%;
    }
    .sub_component{
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:center;
        margin:0;
        width:100%;
        height:auto;
        margin-bottom:5px;
        .ant-form-item-required{
            color:#fff;
        }
        .ant-radio-button-wrapper{
            font-size:12.5px;
        }
        .ant-radio-button-wrapper{
            width:100%;
            text-align:center;
            border-radius:5px;
        }
        .picture_wrap_component{
            width:100%;
            background-color:#454545;
            overflow:hidden;
            div{
                height:100%;
                width:1000%;
                .ant-image{
                    float:left;
                }

            }
            @media screen and (max-width:600px){
                height:200px;
                width:150px;
            }
            @media screen and (max-width:768px){
                height:300px;
                width:225px;
            }
            @media screen and (min-width:769px){
                height:400px;
                width:300px;
            }
            
        }
        #movieType{
            .ant-radio-button-checked{
                z-index:1;
                color:rgb(34,34,34);
                border-color:rgb(34,34,34);
            }
        }
        .ant-form-item-label{
            width:100%;
            display:flex;
            flex-direction:row;
            justify-content:flex-start;
        }
        .ant-form-item-control-input-content{
            width:100%;
            display:flex;
            flex-direction:row;
            align-items:center;
            justify-content:space-evenly;
            .ant-input{
                border-radius:5px;
                &:focus{
                    border:1px solid #454545;
                }
            }
        }
        .ant-btn{
            width:49%;
            height
            border-radius:10px;
        }
    }
`;

const StyledFooter=styled(Footer)`
    background-color:#000;
    height:5.5%;
`;

const CreatingStoryPage = ({history})=>{
    const [movieType,setMovieType]=useState('일반');
    const [imageList,setImageList]=useState([faker.image.imageUrl(),faker.image.imageUrl(),faker.image.imageUrl(),faker.image.imageUrl(),faker.image.imageUrl()]);
    const [imageIndex,setImageIndex] = useState(0);
    const [title,setTitle]=useState('');
    const [author,setAuthor]=useState('');
    const [showCover,setShowCover]=useState(false);
    const dispatch = useDispatch();
    const {storyDataLoading,storyDataLoaded}=useSelector(state=>state.storyData);
    const navigate = useNavigate();

    useEffect(()=>{
        const imgList = document.querySelectorAll(".ant-image");
        console.log(imgList[imageIndex].style);
    },[])

    useEffect(()=>{
        if(!storyDataLoading&&storyDataLoaded){
            navigate('/storyline');
        }
    },[storyDataLoading,storyDataLoaded]);

    const onFormMovieTypeChange = useCallback(({movieType})=>{
        setMovieType(movieType);
    },[])

    const onChangeTitle = useCallback((e)=>{
        setTitle(e.target.value);
    },[])

    const onChangeAuthor = useCallback((e)=>{
        setAuthor(e.target.value);
    },[])

    const onFinishForm = (values)=>{
        console.log(values);
        console.log(imageList[imageIndex]);
        const {author,title,movieType}=values;
        const titlePage = imageList[imageIndex];
        dispatch({type:STORYDATA_LOAD_REQUEST,data:{author,title,movieType,titlePage}});
    }

    const onClickRightOutlined = (e)=>{
        if(imageIndex<imageList.length-1&&imageIndex+1<imageList.length-1){
            console.log(`image Index : ${imageIndex}`);
            const selectedImg = document.querySelectorAll(".ant-image")[imageIndex];
            selectedImg.style.transformOrigin='0% 50%';
            selectedImg.style.transform = 'rotateY(90deg)';
            const nextImg = document.querySelectorAll(".ant-image")[imageIndex+1];
            //nextmg.style.transformOrigin='0% 50%';
            nextImg.style.transform = 'translateX(-225px)';
            selectedImg.style.transition='2s';
            nextImg.style.transition = '2s';
            setImageIndex(prev=>prev+1);
        }else{
            return false;
        }
    }

    const onClickLeftOutlined = (e)=>{
        if(imageIndex>=0&&imageIndex-1>=0){
            console.log(`image Index : ${imageIndex}`);
            const selectedImg = document.querySelectorAll(".ant-image")[imageIndex];
            selectedImg.style.transformOrigin='0% 50%';
            selectedImg.style.transform = 'rotateY(-90deg)';
            const nextImg = document.querySelectorAll(".ant-image")[imageIndex-1];
            //nextmg.style.transformOrigin='0% 50%';
            nextImg.style.transform = 'translateX(+225px)';
            selectedImg.style.transition='2s';
            nextImg.style.transition = '2s';
            setImageIndex(prev=>prev+1);
        }else{
            return false;
        }
    }

    const onClickShowCover=(e)=>{
        setShowCover(prevVal=>!prevVal);
    }

    return(
        <EntireWrap>
            <StyledLayout>
                <StyledHeader>
                    <h1>AI와 함께하는 웹 소설 생성</h1>
                </StyledHeader>
                <StyledContent>
                    <StyledForm 
                        layout={'horizontal'}
                        initialValues={{
                            movieType:movieType
                        }}
                        onFinish={onFinishForm}
                        onValuesChange={onFormMovieTypeChange}
                    >
                        {/* <CoverComponent title={title} author={author} coverImage={imageList[imageIndex]}/> */}
                        <div className="sub_component_container">
                            <Form.Item className="sub_component" label="장르" name="movieType">
                                <Radio.Group value={movieType}>
                                    <Row gutter={[1.5,1.5]}>
                                        <Col xs={8} md={6}><Radio.Button value={"일반"}>일반</Radio.Button></Col>
                                        <Col xs={8} md={6}><Radio.Button value={"미스테리"}>미스테리</Radio.Button></Col>
                                        <Col xs={8} md={6}><Radio.Button value={"무협"}>무협</Radio.Button></Col>
                                        <Col xs={8} md={6}><Radio.Button value={"로맨스"}>로맨스</Radio.Button></Col>
                                        <Col xs={8} md={6}><Radio.Button value={"판타지"}>판타지</Radio.Button></Col>
                                    </Row>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                rules={[{
                                    required:true,
                                    message:'책 제목을 입력해 주세요!'
                                }]} 
                                name="표지선택" label="표지선택" className="sub_component">
                                <div style={{color:'#fff'}}>
                                    <LeftOutlined onClick={onClickLeftOutlined} />
                                </div>
                                <div className="picture_wrap_component">
                                    <div>
                                    {
                                        imageList.map((v,i)=>(<Image width={"10%"} height={"100%"} key={i} src={imageList[imageIndex]}/>))
                                    }
                                    </div>
                                </div>
                                <div style={{color:'#fff'}}>
                                    <RightOutlined onClick={onClickRightOutlined}/>
                                </div>
                            </Form.Item>
                            <Form.Item 
                                rules={[{
                                    required:true,
                                    message:'책 제목을 입력해 주세요!'
                                }]} 
                                className="sub_component" 
                                label="title" 
                                name="title"
                            >
                                <Input value={title} onChange={onChangeTitle}/>
                            </Form.Item>
                            <Form.Item
                                rules={[{
                                    required:true,
                                    message:'작가명(필명)을 입력해 주세요!'
                                }]} 
                                className="sub_component" 
                                label="author" 
                                name="author"
                            >
                                <Input value={author} onChange={onChangeAuthor}/>
                            </Form.Item>
                            
                            <Form.Item className="sub_component">
                                <Button onClick={onClickShowCover}>PREVIEW</Button>
                                <Button loading={storyDataLoading} type="primary" htmlType='submit'>NEXT</Button>
                            </Form.Item>
                        </div>
                    </StyledForm>
                </StyledContent>
                <StyledFooter>

                </StyledFooter>
            </StyledLayout>
        </EntireWrap>
    )
}

export default CreatingStoryPage;