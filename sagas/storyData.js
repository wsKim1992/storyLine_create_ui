import axios from "axios";
import { useNavigate } from "react-router-dom";
import { all, fork, call, delay, put, takeLatest } from "redux-saga/effects";
import {STORYDATA_LOAD_REQUEST,STORYDATA_LOAD_SUCCESS,STORYDATA_LOAD_ERROR} from '../reducers/storyData';

function loadStoryDataAPI(data){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(data);
        },3);
    })
}

function* loadStoryData(action){
    try{
        const navigate = action.navigate;
        yield put({type:STORYDATA_LOAD_SUCCESS,storyData:action.data});
        navigate('/storyline',{replace:true});
    }catch(err){
        console.log(err.response.data);
        yield put({type:STORYDATA_LOAD_ERROR,errorData:err.response.data});
    }
}

function* createStoryData(){
    yield takeLatest(STORYDATA_LOAD_REQUEST,loadStoryData);
}

export default function* storyData(){
    yield all([
        fork(createStoryData)
    ])
}