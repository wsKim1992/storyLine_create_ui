import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, PDFViewer } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

Font.register({
    family: 'SpoqaHanSans',
    src: 'https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@01ff0283e4f36e159ffbf744b36e16ef742da6d8/Subset/SpoqaHanSans/SpoqaHanSansLight.ttf',
});

const styles = StyleSheet.create({
    pdfViewer: {
        width: '100%',
        height: '100%',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    titlePageSection: {
        padding: 0
    },
    titlePage: {
        width: '100%',
        height: '100%',
        padding: 0,
    },
    page: {
        fontFamily: 'SpoqaHanSans',
        backgroundColor: "#ffffff",
        flexDirection: "column",
        padding: 100,
    },
    titleImage: {
        width: '100%',
        height: '100%',
    },
    textArea: {
        width: '100%',
        height: '97.5%',
        fontSize: 11.5,
        textAlign: 'justify',
        textIndent: 20
    },
    textPageNumber: {
        fontSize: 10.5,
        width: '100%',
        height: '2.5%',
        textAlign: 'right'
    }
});

const StorylinePDFDocument = ()=>{
    const { createdStory, creatingStory } = useSelector(state => state.storyline);
    const { storyData } = useSelector(state => state.storyData);
    const [entireStory, setEntireStory] = useState([]);

    useEffect(() => {
        const storylineIntoChunk = [
            ...createdStory.map(v => (v.outputText)),
            creatingStory.inputType === 'image' ? creatingStory.outputText[creatingStory.index]
                : (
                    creatingStory.inputText ?
                        creatingStory.inputText.concat(creatingStory.outputText[creatingStory.index])
                        : creatingStory.outputText[creatingStory.index]
                )
        ].join('\n\n');
        const totalLength = storylineIntoChunk.length;
        const offset = 1220;
        const numOfLoops = parseInt(totalLength / offset);
        const splitedIntoOffsetChunks = [];
        for (let i = 0; i <= numOfLoops; i += 1) {
            splitedIntoOffsetChunks.push(storylineIntoChunk.slice(offset * i, offset * (i + 1)));
        }
        console.log(splitedIntoOffsetChunks);
        setEntireStory([...splitedIntoOffsetChunks]);
    }, [])
    
    return (
        <Document>
            {
                storyData.pageCoverDataURL &&
                <Page size="A4" style={styles.titlePage}>
                    <View style={styles.titlePageSection}>
                        <Image src={storyData.pageCoverDataURL} style={styles.titleImage} />
                    </View>
                </Page>
            }
            {
                (createdStory.length !== 0 && createdStory !== null && entireStory.legnth !== 0) &&
                entireStory.map((v, i) => (
                    <Page key={`${i}_page`} pageNumber={i} size="A4" style={styles.page}>
                        <View render={({ pageNumber, totalPages }) => (
                            <View key={`${i}_view`} style={styles.section}>
                                <Text key={`${i}_text`} style={styles.textArea}>
                                    {v}
                                </Text>
                                <Text style={styles.textPageNumber}> {`${pageNumber-1}`}</Text>
                            </View>
                        )} />
                    </Page>
                ))
            }
        </Document>
    )
}

export default StorylinePDFDocument;