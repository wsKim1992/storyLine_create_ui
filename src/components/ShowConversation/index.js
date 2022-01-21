import React, { useEffect,useRef,useState } from 'react';
import ConversationComponent from './ConversationComponent';
import InputComponent from './InputComponent';
import {Row,Col,Layout} from 'antd';
import { useSelector } from 'react-redux';
import ShowAllOutputText from './ShowAllOutputText';
import html2canvas from 'html2canvas';
import {jsPDF} from "jspdf";
import "jspdf/dist/polyfills.es.js";

const {Content}=Layout;

const ConversationIndex = ()=>{
    const conversationRef = useRef(null);
    const {createdStory,creatingStory,showEntireStory,loadingStory,newStoryLoading} = useSelector((state)=>state.storyline);
    const {storyData}= useSelector(state=>state.storyData);
    
    const [isSpeak,setIsSpeak] = useState(false);
    const [message,setMessage]= useState('');
    const [downloadInPDF,setDownloadInPDF]=useState();
    const showPDFRef = useRef(null);

    useEffect(()=>{
        if(downloadInPDF&&showPDFRef.current){
            const input = showPDFRef.current;
            html2canvas(input)
                .then((canvas)=>{
                    console.log(canvas);
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                    pdf.addImage(imgData,'JPEG',0,0);
                    pdf.save("download.pdf");
                })
        }
    },[downloadInPDF,showPDFRef.current])

    useEffect(()=>{
        conversationRef.current.scrollTo(0,conversationRef.current.scrollHeight-conversationRef.current.clientHeight);
    },[createdStory,creatingStory])

    return(
        <React.Fragment>
            <Content style={{width:'100%',height:'100%'}}>
                <Row style={{width:'100%',height:'100%'}}>
                    {
                    <Col ref={conversationRef} style={{position:'relative',overflowY:'auto',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',border:'1px solid #454545',borderRadius:'10px',height:'77.5%'}} xs={24}>
                        {
                            showEntireStory?
                            <ShowAllOutputText showPDFRef={showPDFRef} pageCoverDataURL={storyData.pageCoverDataURL}/>
                            :<ConversationComponent/>
                        }
                    </Col>
                    }
                    <Col style={{height:'20%'}} xs={24}>
                        <InputComponent message={message} setMessage={setMessage} isSpeak={isSpeak} setIsSpeak={setIsSpeak} setDownloadInPDF={setDownloadInPDF}/>
                    </Col>
                </Row>
            </Content>
        </React.Fragment>
    )
}

export default ConversationIndex;