import {all,fork,put,takeLatest,delay,call} from 'redux-saga/effects';
import {LOAD_STORY_REQUEST,LOAD_STORY_SUCCESS,LOAD_STORY_FAILURE
    ,ENCODE_AND_SAVE_REQUEST,ENCODE_SINGLE_TEXT,ENCODE_AND_SAVE_SUCCESS
    ,DECODE_AND_UPLOAD_REQUEST,DECODE_AND_UPLOAD_SUCCESS,CHANGE_LAST_STORY_INDEX_REQUEST
    ,CHANGE_LAST_STORY_INDEX_SUCCESS,ENCODE_AND_SAVE_FAILURE, CHANGE_LAST_STORY_INDEX_ERROR} from '../reducers/storyline';
import axios from 'axios';

const loadStoryAPI =(data)=>{
    const formData = new FormData();
    formData.append('function',`generate_${data.storyMode}`);
    formData.append('input_text',data.inputText);

    return axios.post('/ai-tools',formData);
}

function* loadStory(action){
    try{
        const output = yield call(loadStoryAPI,action.data);
        console.log(output.data);
        console.log({...action.data});
        yield put({
            type:LOAD_STORY_SUCCESS,
            data:{...action.data,outputText:output.data['output_ko']}
        });
    }catch(err){
        yield put({
            type:LOAD_STORY_FAILURE,
            error:err.response.data,
        });
    }
}

function* watchLoadStory(){
    yield takeLatest(LOAD_STORY_REQUEST,loadStory);
}

function* encodeSingleParagraph(data){
    const {id,inputType,inputText,outputText}=data;
    const outputStrUTF8 = encodeURI(outputText);
    const outputStrBase64 = window.btoa(outputStrUTF8);
    const inputStrUTF8 = inputType==='text'?encodeURI(inputText):inputText;
    const inputStrBase64 = inputType==='text'?window.btoa(inputStrUTF8):inputText;
    const encodedText = [window.btoa(encodeURI(id)),window.btoa(encodeURI(inputType)),inputStrBase64,outputStrBase64].join('\n///\n'); 
    yield put({type:ENCODE_SINGLE_TEXT,data:encodedText});
}

function* encodeAndSave(action){
    yield all([...action.data.map(v=>fork(encodeSingleParagraph,v))]);
    yield put({type:ENCODE_AND_SAVE_SUCCESS});
}

function* watchEncodeAndSave(){
    yield takeLatest(ENCODE_AND_SAVE_REQUEST,encodeAndSave);
}

function decodeSingleParagraph(singleParagraph){
    return new Promise((resolve)=>{
        const strArr = [...singleParagraph.split('\n///\n')];
        const id = parseInt(decodeURI(window.atob(strArr[0])));
        const inputType = decodeURI(window.atob(strArr[1]));
        const inputText = inputType==='text'?decodeURI(window.atob(strArr[2])):strArr[2];
        const outputText = decodeURI(window.atob(strArr[3]));
        resolve({id,inputType,inputText,outputText});
    })
}

async function decodeTextData(textData){
    const textDataSplitArr = [...textData.split('\n************\n')];
    const resultArr = await Promise.all(textDataSplitArr.map(async v=>{
        return decodeSingleParagraph(v);
    }));
    return resultArr;
}

function* decodeAndUpload(action){
    const {textData}=action;
    const resultArr = (yield call(decodeTextData,textData)).sort((a,b)=>a.id-b.id);
    yield put({type:DECODE_AND_UPLOAD_SUCCESS,data:resultArr})
}

function* watchDecodeAndUpload(){
    yield takeLatest(DECODE_AND_UPLOAD_REQUEST,decodeAndUpload);
}

function callChangeLastStoryAPI(data){
    const formData = new FormData();
    formData.append('function',`generate_${data.storyMode}`);
    formData.append('input_text',data.inputText);
    return axios.post('/ai-tools',formData);
}

function* changeLastStory(action){
    try{
        const outputResp = yield call(callChangeLastStoryAPI,action.data);
        console.log(outputResp);
        yield put({type:CHANGE_LAST_STORY_INDEX_SUCCESS,data:outputResp.data['output_ko']});
    }catch(err){
        console.error(err);
        yield put({type:CHANGE_LAST_STORY_INDEX_ERROR,data:err.response.data});
    }
}

function* watchChangeLastStoryIndexRequest(){
    yield takeLatest(CHANGE_LAST_STORY_INDEX_REQUEST,changeLastStory);
}

export default function* storylineSaga(){
    yield all([
        fork(watchLoadStory),
        fork(watchEncodeAndSave),
        fork(watchDecodeAndUpload),
        fork(watchChangeLastStoryIndexRequest),
    ])
}