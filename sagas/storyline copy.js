import {all,fork,put,takeLatest,delay,call} from 'redux-saga/effects';
import {LOAD_STORY_REQUEST,LOAD_STORY_SUCCESS,LOAD_STORY_FAILURE
    ,ENCODE_AND_SAVE_REQUEST,ENCODE_SINGLE_TEXT,ENCODE_AND_SAVE_SUCCESS
    ,DECODE_AND_UPLOAD_REQUEST,DECODE_SINGLE_TEXT,ENCODE_AND_SAVE_FAILURE} from '../reducers/storyline';
import axios from 'axios';

const loadStoryAPI =(action,data)=>{
    return axios.post('/api/loadStory',data);
}

function* loadStory(action){
    try{
        console.log(encodeURI('안녕하세요'));
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



function* decodeSingleParagraph(singleParagraph){
    const strArr = [...singleParagraph.split('\n///\n')];
    console.log(strArr);
    const id = parseInt(decodeURI(window.atob(strArr[0])));
    const inputType = decodeURI(window.atob(strArr[1]));
    const inputText = inputType==='text'?decodeURI(window.atob(strArr[2])):strArr[2];
    const outputText = decodeURI(window.atob(strArr[3]));
    yield put({type:DECODE_SINGLE_TEXT});
}


function* decodeAndUpload(action){
    const {textData}=action;
    const textDataSplitArr = [...textData.split('\n************\n')];
    yield all([...textDataSplitArr.map(v=>fork(decodeSingleParagraph,v))]);
    yield put({type:DECODE_AND_UPLOAD_SUCCESS});
}

function* watchDecodeAndUpload(){
    yield takeLatest(DECODE_AND_UPLOAD_REQUEST,decodeAndUpload);
}

export default function* storylineSaga(){
    yield all([
        fork(watchLoadStory),
        fork(watchEncodeAndSave),
        fork(watchDecodeAndUpload),
    ])
}