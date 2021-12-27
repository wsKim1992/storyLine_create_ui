import {all,fork} from 'redux-saga/effects';
import storylineSaga from './storyline';
import storyData from './storyData';
/* import axios from 'axios';

axios.defaults.baseURL='http://1.201.8.82:9996/'; */
export default function* rootSaga(){
    yield all([
        fork(storylineSaga),
        fork(storyData),
    ])
}