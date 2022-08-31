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

    const MainDocument = ()=>{
        return(
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
        )
    }

    return (
        <PDFViewer style={styles.pdfViewer}>
            <MainDocument/>
        </PDFViewer>
    )
}

export default PDFDocument;