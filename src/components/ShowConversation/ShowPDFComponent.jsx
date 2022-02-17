import React from 'react';
import { Document, Page, Text, View, StyleSheet,Font, 
    Image, PDFViewer } from '@react-pdf/renderer';
import {useSelector} from 'react-redux';
import { useEffect } from 'react';
import font from '../../../static/font/NotoSerifKR-Bold.ttf';
import koreanFont from '../../../static/font/HMFMPYUN.TTF';

Font.register({
    family: 'SpoqaHanSans',
    src:'https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@01ff0283e4f36e159ffbf744b36e16ef742da6d8/Subset/SpoqaHanSans/SpoqaHanSansLight.ttf',
  });

const styles = StyleSheet.create({
    pdfViewer:{
        width:'120%',
        height:'100%',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    page:{
        fontFamily:'SpoqaHanSans',
        backgroundColor:"#ffffff",
        flexDirection:"column",
        padding:15,
    },
    titleImage:{
        width:'100%',
        height:'100%',
    },
    textArea:{
        width:'100%',
        height:'100%',
        fontSize:18.5,
    }
});

const PDFDocument = () => {
    const {createdStory,creatingStory} = useSelector(state=>state.storyline);
    const {storyData} = useSelector(state=>state.storyData);

    useEffect(()=>{
        console.log(storyData.pageCoverDataURL);
        console.log(createdStory);
    },[])

    return (
        <PDFViewer style={styles.pdfViewer}>
            <Document>
                {
                    storyData.pageCoverDataURL&&
                    <Page size="A4" style={styles.page}>
                        <View style={styles.section}>
                            <Image src={storyData.pageCoverDataURL} style={styles.titleImage}/>
                        </View>
                    </Page>
                }
                {
                    (createdStory.length!==0 && createdStory!==null)&&
                    <Page size="A4" style={styles.page}>
                        <View style={styles.section}>
                            <Text style={styles.textArea}>
                                {createdStory[0].outputText}
                            </Text>
                        </View>
                    </Page>
                }
            </Document>
        </PDFViewer>
    )
}

export default PDFDocument;