import React from 'react';
import { Document, Page, Text, View, StyleSheet, 
    Image, PDFViewer } from '@react-pdf/renderer';
import {useSelector} from 'react-redux';

const styles = StyleSheet.create({
    pdfViewer:{
        width:window.innerWidth,
        height:window.innerHeight,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    page:{
        backgroundColor:"#ffffff",
        flexDirection:"column",
        padding:15,
    },
    titleImage:{
        width:'100%',
        height:'100%',
    }
});

const PDFDocument = () => {
    const {createdStory,creatingStory} = useSelector(state=>state.storyline);
    const {storyData} = useSelector(state=>state.storyData)
    return (
        <PDFViewer style={styles.pdfViewer}>
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Image src={"/assets/img/sampleImg.png"} style={styles.titleImage}/>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    )
}

export default PDFDocument;