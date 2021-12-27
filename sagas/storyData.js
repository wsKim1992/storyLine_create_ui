import axios from "axios";
import { all, fork, call, delay, put, takeLatest } from "redux-saga/effects";
import {STORYDATA_LOAD_REQUEST,STORYDATA_LOAD_SUCCESS,STORYDATA_LOAD_ERROR} from '../reducers/storyData';

function loadStoryDataAPI(data){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(data);
        },3000);
    })
}

function* loadStoryData(action){
    try{
        const storyData=yield call(loadStoryDataAPI,action.data);
        yield put({type:STORYDATA_LOAD_SUCCESS,storyData});
    }catch(err){
        console.log(err.response.data);
        yield put({type:STORYDATA_LOAD_ERROR,errorData:err.response.data});
    }
}

function* createStoryData(action){
    yield takeLatest(STORYDATA_LOAD_REQUEST,loadStoryData);
}

export default function* storyData(){
    yield all([
        fork(createStoryData)
    ])
}