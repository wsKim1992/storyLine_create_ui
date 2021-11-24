import React from 'react';
import AppLayout from './components/AppLayout';
import StoryLinePage from './pages/StoryLinePage';
import {hot} from "react-hot-loader";
import '../static/css/main.css';
import { Provider } from 'react-redux';
import store from '../store/configureStore'

const App=()=>{
    return(
        <>
            <AppLayout>
                <Provider store={store}>
                    <StoryLinePage />
                </Provider>
            </AppLayout>
        </>
    )
}

export default hot(module)(App);