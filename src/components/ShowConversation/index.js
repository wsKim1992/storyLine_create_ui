import React, { useEffect, useRef, useState } from 'react';
import ConversationComponent from './ConversationComponent';
import InputComponent from './InputComponent';
import { Row, Col, Layout } from 'antd';
import { useSelector } from 'react-redux';
import ShowAllOutputText from './ShowAllOutputText';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import "jspdf/dist/polyfills.es.js";
import ShowPDFComponent from './ShowPDFComponent';

const { Content } = Layout;

const ConversationIndex = () => {
    const conversationRef = useRef(null);
    const { createdStory, creatingStory, showEntireStory, loadingStory, newStoryLoading } = useSelector((state) => state.storyline);
    const { storyData } = useSelector(state => state.storyData);
    const { pageCoverDataURL } = storyData;
    const [isSpeak, setIsSpeak] = useState(false);
    const [message, setMessage] = useState('');
    const [showInPDF, setShowInPDF] = useState(false);
    const showPDFRef = useRef(null);
    const textElementsIntoPDFRef = useRef([]);

    useEffect(() => {
        conversationRef.current.scrollTo(0, conversationRef.current.scrollHeight - conversationRef.current.clientHeight);
    }, [createdStory, creatingStory]);

    return (
        <React.Fragment>
            {
                showInPDF ?
                    <ShowPDFComponent />
                    : (
                        <Content style={{ width: '100%', height: '100%', backgroundColor: 'rgba(45,45,45,0.6)' }}>
                            <Row style={{ width: '100%', height: '100%' }}>
                                {
                                    <Col ref={conversationRef} style={{ position: 'relative', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid #454545', borderRadius: '10px', height: '79.5%' }} xs={24}>
                                        {
                                            showEntireStory ?
                                                <ShowAllOutputText showPDFRef={showPDFRef} textElementsIntoPDFRef={textElementsIntoPDFRef} pageCoverDataURL={storyData.pageCoverDataURL} />
                                                : <ConversationComponent />
                                        }
                                    </Col>
                                }
                                <Col style={{ height: '20%' }} xs={24}>
                                    <InputComponent message={message} setMessage={setMessage} isSpeak={isSpeak} setIsSpeak={setIsSpeak} setShowInPDF={setShowInPDF} />
                                </Col>
                            </Row>
                        </Content>
                    )
            }
        </React.Fragment>
    )
}

export default ConversationIndex;