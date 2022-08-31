import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Button, Row, Col } from 'antd';
import { FilePdfOutlined, FileWordOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { ENCODE_AND_SAVE_REQUEST, ENCODE_AND_SAVE_INIT } from '../../../reducers/storyline';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import StorylinePDFDocument from './StorylinePDFDocument';
import store from '../../../store/configureStore';
/* import StroylineWordDocument from './StorylineWordDocument'; */
/* import {render} from 'redocx'; */

const StyledButtonWrap = styled.div`
    width:auto;height:100%;
    border-radius:10px;
    position:absolute;
    left:50%;top:-100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color:#454545;
`;

const StyledRow = styled(Row)`
    width:auto;
    height:80%;
    padding:5.5px;
`;

const StyledCol = styled(Col)`
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

const saveFile = async (blob, fileName, ext) => {

    if (window.showSaveFilePicker) {
        const opts = {
            types: [{
                description: 'Text file',
                accept: { 'text/*': [ext] },
            }],
        };
        const fileHandle = await window.showSaveFilePicker(opts);
        const fileStream = await fileHandle.createWritable();
        await fileStream.write(blob);
        await fileStream.close();
    } else {
        const fileURL = window.URL.createObjectURL(blob);
        const aTag = document.createElement('a');
        aTag.href = fileURL;
        aTag.download = fileName;
        aTag.click();
        window.URL.revokeObjectURL(fileURL);
    }
}

const SaveFileTypesComponent = () => {
    const { encodedStoryLine, createdStory, creatingStory, encodeAndSaveLoaded, encodeAndSaveLoading } = useSelector((state) => state.storyline);
    const dispatch = useDispatch();
    const pdfBlobRef = useRef(null);

    useEffect(()=>{
        if(pdfBlobRef.current){
            console.log(pdfBlobRef.current);
        }
    },[pdfBlobRef.current])

    useEffect(() => {
        if (encodeAndSaveLoaded && !encodeAndSaveLoading) {
            const blob = new Blob([encodedStoryLine], { type: 'text/plain' });
            const fileName = `${Date.now()}.pkg`;
            saveFile(blob, fileName, '.pkg');
            dispatch({ type: ENCODE_AND_SAVE_INIT });
        }
    }, [encodeAndSaveLoaded, encodeAndSaveLoading, encodedStoryLine]);

    const onClickPKG = useCallback((evt) => {
        if (!creatingStory || createdStory.length === 0) {
            alert('스토리를 생성 해주세요!');
            return false;
        }
        if (creatingStory) {
            dispatch({ type: ENCODE_AND_SAVE_REQUEST, data: [...createdStory, { ...creatingStory, outputText: creatingStory.outputText[creatingStory.index] }] });
        } else {
            dispatch({ type: ENCODE_AND_SAVE_REQUEST, data: [...createdStory] });
        }
    }, [creatingStory, createdStory])

    const onClickWord = useCallback((evt)=>{
        
    },[])

    const pdfElement = (
        <Provider store={store}>
            <StorylinePDFDocument />
        </Provider>
    )

    return (
        <StyledButtonWrap>
            <StyledRow gutter={[1.5, 1.5]} justify="center">
                <StyledCol span={1.5}>
                    <StyledButton>
                        <PDFDownloadLink
                            document={
                                pdfElement
                            }
                            fileName={"PDF_REPORT.pdf"}
                        >
                            <FilePdfOutlined />
                            <p>Save as <br /> PDF</p>
                        </PDFDownloadLink>
                    </StyledButton>
                </StyledCol>
                <StyledCol span={1.5}>
                    <StyledButton onClick={onClickWord}>
                        <FileWordOutlined />
                        <p>Save as <br /> Word</p>
                    </StyledButton>
                </StyledCol>
                <StyledCol span={1.5}>
                    <StyledButton onClick={onClickPKG}>
                        <p>Save as <br /> PKG</p>
                    </StyledButton>
                </StyledCol>
            </StyledRow>
        </StyledButtonWrap>
    )
}

export default SaveFileTypesComponent;