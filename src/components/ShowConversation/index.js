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

const loadImageOnPDF = (doc,pageCoverDataURL,pdfWidth,pdfHeight)=>{
    return new Promise((resolve,reject)=>{
        const titleImage = new Image;
        titleImage.src = pageCoverDataURL;
        titleImage.onload = ()=>{
            doc.addImage(titleImage,'PNG',0,0,pdfWidth,pdfHeight);
            resolve();
        }
    })
}

const ConversationIndex = ()=>{
    const conversationRef = useRef(null);
    const {createdStory,creatingStory,showEntireStory,loadingStory,newStoryLoading} = useSelector((state)=>state.storyline);
    const {storyData}= useSelector(state=>state.storyData);
    const {pageCoverDataURL}=storyData;
    const [isSpeak,setIsSpeak] = useState(false);
    const [message,setMessage]= useState('');
    const [downloadInPDF,setDownloadInPDF]=useState(false);
    const showPDFRef = useRef(null);
    const [renderPdf,setRenderPdf] = useState(null);

    useEffect(async()=>{
        if(downloadInPDF&&showPDFRef.current){
            const pdfHeight = 512;
            const pdfWidth = 384;
            const offsetX = parseFloat(pdfWidth/10);
            const offsetY = parseFloat(pdfHeight/10); 
            const fontSize = 18.5;
            let doc = new jsPDF("p","px",[pdfWidth,pdfHeight]);
            doc.setFontSize(fontSize);
            await loadImageOnPDF(doc,pageCoverDataURL,pdfWidth,pdfHeight);
            doc.addPage([384,512],"p");
            doc.text(10,10,creatingStory.outputText[creatingStory.index]);
            doc.save(`${Date.now()}.pdf`);
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