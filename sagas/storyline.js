import {all,fork,put,takeLatest,delay,call} from 'redux-saga/effects';
import {LOAD_STORY_REQUEST,LOAD_STORY_SUCCESS,LOAD_STORY_FAILURE
    ,ENCODE_AND_SAVE_REQUEST,ENCODE_SINGLE_TEXT,ENCODE_AND_SAVE_SUCCESS
    ,DECODE_AND_UPLOAD_REQUEST,DECODE_AND_UPLOAD_SUCCESS,CHANGE_LAST_STORY_INDEX_REQUEST
    ,CHANGE_LAST_STORY_INDEX_SUCCESS,ENCODE_AND_SAVE_FAILURE, CHANGE_LAST_STORY_INDEX_ERROR} from '../reducers/storyline';
import axios from 'axios';

const genreApiFuncList = {
    '일반':'generate_story',
    '로맨스':'gpt2_genre_romance',
    '판타지':'gpt2_genre_fantasy',
    '미스테리':'gpt2_genre_mystery',
    '무협':'gpt2_genre_martial'
}

const loadStoryAPI =(data)=>{
    const formData = new FormData();
    formData.append('function',genreApiFuncList[data.genre]);
    formData.append('input_text',data.inputText);
    formData.append('tokens',128);
    return axios.post('/ai-tools',formData);
}

const loadStoryWithImageAPI = (data)=>{
    const dataDecodeBinary = window.atob(data.inputText.split(",")[1]);
    let binaryCodeArr = [];
    for(let i =0;i<dataDecodeBinary.length;i++){binaryCodeArr.push(dataDecodeBinary.charCodeAt(i))};
    const imageFileBlob = new Blob([new Uint8Array(binaryCodeArr)],{'type':'image/jpeg'});
    const formData = new FormData();
    formData.append("function","image_captioning");
    formData.append("image",imageFileBlob,'filename');
    formData.append('input_text','');
    const header = {headers:{'Content-Type':'multipart/form-data'}};
    return axios.post('/ai-tools',formData,header);
}

function* loadStory(action){
    try{
        const {inputType,inputText,genre}=action.data;
        /* console.log(`inputType : ${inputType}`);
        console.log(`inputText : ${inputText}`);
        console.log(`input Genre : ${genreApiFuncList[genre]}`); */
        const output = inputType ==='image'?yield call(loadStoryWithImageAPI,action.data):yield call(loadStoryAPI,action.data);
        const outputText = action.data.storyMode==='talk'?output.data['output_ko'].split("\n\n").map(v=>`\"${v}\"`):output.data['output_ko'].replace('\n','');
        console.log(outputText); 
        yield put({
            type:LOAD_STORY_SUCCESS,
            data:{...action.data,outputText}
        });
    }catch(err){
        yield put({
            type:LOAD_STORY_FAILURE,
            error:'err.response.data',
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
    const data = resultArr.filter((v,i)=>i!==resultArr.length-1);
    const creating_data = {
        id:resultArr[resultArr.length-1].id,
        inputType:resultArr[resultArr.length-1].inputType,
        inputText:resultArr[resultArr.length-1].inputText,
        outputText:[resultArr[resultArr.length-1].outputText],
        storyMode:'story',
        index:0
    };
    yield put({type:DECODE_AND_UPLOAD_SUCCESS,data,creating_data});
}

function* watchDecodeAndUpload(){
    yield takeLatest(DECODE_AND_UPLOAD_REQUEST,decodeAndUpload);
}

function callChangeLastStoryAPI(data){
    const formData = new FormData();
    formData.append('function',genreApiFuncList[data.genre]);
    formData.append('input_text',data.inputText);
    formData.append('tokens',128);
    return axios.post('/ai-tools',formData);
}

function* changeLastStory(action){
    const {inputType,inputText,genre}=action.data;
    console.log(inputType);
    try{
        const outputResp = inputType ==='image'?yield call(loadStoryWithImageAPI,action.data): yield call(callChangeLastStoryAPI,action.data);
        console.log(outputResp.data);
        yield put({type:CHANGE_LAST_STORY_INDEX_SUCCESS,data:outputResp.data['output_ko'],isOutput:action.data.isOutput});
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