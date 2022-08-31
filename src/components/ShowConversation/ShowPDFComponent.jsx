import React from 'react';
import { StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Provider } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { MobilePDFViewer } from './StorylineStyleForViewer';

import StorylinePDFDocument from './StorylinePDFDocument';
import StorylineDocumentForMobile from './StorylineDocumentForMobile';
import store from '../../../store/configureStore';

const styles = StyleSheet.create({
    pdfViewer: {
        width: '100%',
        height: '100%',
    },
});

const PDFDocument = () => {

    return (
        <>
            {isMobile ?
                (
                    <MobilePDFViewer>
                        <StorylineDocumentForMobile/>
                    </MobilePDFViewer>
                ) : (
                    <PDFViewer style={styles.pdfViewer}>
                        <Provider store = {store}>
                            <StorylinePDFDocument />
                        </Provider>
                    </PDFViewer>
                )
            }
        </>
    )
}

export default PDFDocument;