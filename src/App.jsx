import React from 'react';
import AppLayout from './components/AppLayout';
import StoryLinePage from './pages/StoryLinePage';
import {hot} from "react-hot-loader";
import '../static/css/main.css';
import '../static/css/font.css';
import { Provider } from 'react-redux';
import store from '../store/configureStore'
import {BrowserRouter,Routes,Navigate ,Route} from 'react-router-dom';
import Dictaphone from './pages/TestReactSpeechAPI';
import Example from './pages/TestReactSpeechKit';
import AudioRecord from './pages/TestRecord';
import MicAndAudioTest from './pages/TestRecordTest4';
import CreatingStoryPage from './pages/CreatingStoryPage';
import MainPage from './pages/MainPage';
import 'antd/dist/antd.css';
import MyDocument from './pages/ReactPDFPage';

const App=()=>{
    return(
        <>
            <AppLayout>
                <Provider store={store}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Navigate to="main"/>}/>
                            <Route path = "main" element={<MainPage/>}/>
                            <Route path="storyline" element={<StoryLinePage />} />
                            <Route path="test_mic" element={<Dictaphone />}/>
                            <Route path="test_mic2" element={<Example />}/>
                            <Route path="test_mic3" element={<AudioRecord />}/>
                            <Route path="test_mic4" element={<MicAndAudioTest/>}/>
                            <Route path="creating_story" element={<CreatingStoryPage/>}/>
                            <Route path = "reactPDF" element={<MyDocument/>}/> 
                        </Routes> 
                    </BrowserRouter>
                </Provider>
            </AppLayout>
        </>
    )
}

export default App;