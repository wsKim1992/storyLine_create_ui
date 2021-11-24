import {all,fork,put,takeLatest,delay,take} from 'redux-saga/effects';
import {LOAD_STORY_REQUEST,LOAD_STORY_SUCCESS,LOAD_STORY_FAILURE} from '../reducers/storyline';
import axios from 'axios';

const loadStoryAPI =(action,data)=>{
    return axios.post('/api/loadStory',data);
}

function* loadStory(action){
    try{
        yield delay(2000);
        yield put({
            type:LOAD_STORY_SUCCESS,
            data:action.data
        });
    }catch(err){
        yield put({
            type:LOAD_STORY_FAILURE,
            error:err.response.data,
        });
    }
}

function* watchLoadStory(){
    yield takeLatest(LOAD_STORY_REQUEST,loadStory)
}

export default function* storylineSaga(){
    yield all([
        fork(watchLoadStory),
    ])
}