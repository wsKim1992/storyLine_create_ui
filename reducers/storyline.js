import produce from 'immer';
import faker from 'faker';

const initiallState={
    createdStory:[
        {
            id:12121621,
            inputType:'text'
            ,inputText:'폰트실험중...'
            ,outputText:'멀어지는 박쥐를 보고 있던 할머니는 고개를 돌려 손자 알보르를 쳐다보았다. 박쥐를 함부로 죽이면 안 된단다.  에이, 박쥐는 더럽고 불길하잖아요. 치사하기도 하구요.'
        },
        {
            id:12345678,
            inputType:'text'
            ,inputText:'폰트실험중...'
            ,outputText:'아, 들어가야지.  어? 잠시만…….  나에게 다가오던 우진은 내 앞에 서 있는 여자를 보고는 고개를 갸우뚱하며 걸음을 멈췄다. 아는 사이인가?'
        },
        {
            id:14321234,
            inputType:'text'
            ,inputText:'폰트실험중...'
            ,outputText:'에 서 있는 여자를 보고는 고개를 갸우뚱하며 걸음을 멈췄다. 아는 사이인가?왔어?를 말한 화자는 누구일까? 그녀는 바로 나였다.내가 말했다.  아니야, 아니야. 내가 먼저 말했잖아.'
        },
        {
            id:23454123,
            inputType:'image'
            ,inputText:faker.image.imageUrl()
            ,outputText:'이런 상황은 나도 처음이라 이러지도 저러지도 못하고 있었는데 뒤에서 "주하린!"하고 나를 부르는 소리가 들렸다. 뒤를 돌아보자 고등학교 동창이자 곧 결혼 예정인 남자친구 우진이 이쪽으로 걸어오고 있었다. 왔어? 안 들어가고 뭐 해? 아, 들어가야지.  어? 잠시만…….  나에게 다가오던 우진은 내 앞에 서 있는 여자를 보고는 고개를 갸우뚱하며 걸음을 멈췄다. 아는 사이인가?'
        },
    ],
    creatingStory:{
        id:23454122,
        inputType:'text',
        inputText:'안녕하세요!!',
        index:0,
        storyMode:'story',
        outputText:['안녕하세요 김우석 입니다','이 서비스는 AI 던전 한글판 입니다','많이들 사용 바랍니다!!']
    },
    loadingStory:false,
    loadedStory:false,
    loadStoryError:null,
    encodeAndSaveLoading:false,
    encodeAndSaveLoaded:false,
    encodeAndSaveError:null,
    encodeStrArr:[],
    encodedStoryLine:null,
    decodeAndUploadLoading:false,
    decodeAndUploadLoaded:false,
    decodeAndUploadError:null,
    newStoryLoaded:false,
    newStoryLoading:false,
    newStoryError:null,
}

export const LOAD_STORY_REQUEST = 'LOAD_STORY_REQUEST';
export const LOAD_STORY_SUCCESS = 'LOAD_STORY_SUCCESS';
export const LOAD_STORY_FAILURE = 'LOAD_STORY_FAILURE';
export const CHANGE_LAST_STORY_INDEX= 'CHANGE_LAST_STORY_INDEX';
export const CHANGE_STORYLINE = 'CHANGE_STORYLINE';
export const ENCODE_AND_SAVE_REQUEST = 'ENCODE_AND_SAVE_REQUEST';
export const ENCODE_AND_SAVE_SUCCESS ='ENCODE_AND_SAVE_SUCCESS';
export const ENCODE_AND_SAVE_FAILURE ='ENCODE_AND_SAVE_FAILURE';
export const ENCODE_SINGLE_TEXT = 'ENCODE_SINGLE_TEXT';
export const ENCODE_AND_SAVE_INIT = 'ENCODE_AND_SAVE_INIT';
export const DECODE_AND_UPLOAD_REQUEST ='DECODE_AND_UPLOAD_REQUEST';
export const DECODE_AND_UPLOAD_SUCCESS ='DECODE_AND_UPLOAD_SUCCESS';
export const DECODE_AND_UPLOAD_FAILURE ='DECODE_AND_UPLOAD_FAILURE';
export const CHANGE_LAST_STORY_INDEX_REQUEST = 'CHANGE_LAST_STORY_INDEX_REQUEST';
export const CHANGE_LAST_STORY_INDEX_SUCCESS = 'CHANGE_LAST_STORY_INDEX_SUCCESS';
export const CHANGE_LAST_STORY_INDEX_ERROR = 'CHANGE_LAST_STORY_INDEX_ERROR';
export const loadStory = (data)=>{
    return{type:LOAD_STORY_REQUEST,data}
}

const dummpyStoryLine = (data)=>{
    return{
        id:Date.now(),
        inputType:data.inputType,
        inputText:data.inputText,
        index:0,
        storyMode:data.storyMode,
        outputText:[data.outputText]
    };
}

const reducer = (state=initiallState,action)=>{
    return produce(state,(draft)=>{
        switch (action.type){
            case DECODE_AND_UPLOAD_REQUEST:{
                draft.decodeAndUploadLoading=true;
                draft.decodeAndUploadLoaded=false;
                break;
            }
            case DECODE_AND_UPLOAD_SUCCESS:{
                draft.decodeAndUploadLoading=false;
                draft.decodeAndUploadLoaded=true;
                draft.createdStory=[...action.data];
                draft.creatingStory=null;
                break;
            }
            case DECODE_AND_UPLOAD_FAILURE:{
                draft.decodeAndUploadError=action.error;
                draft.decodeAndUploadLoading=false;
                break;
            }
            case ENCODE_AND_SAVE_INIT:{
                draft.encodeStrArr=[];
                draft.encodedStoryLine=null;
                draft.encodeAndSaveLoaded=false;
                draft.encodeAndSaveError=null;
                break;
            }
            case ENCODE_SINGLE_TEXT:{
                draft.encodeStrArr.push(action.data);
                break;
            }
            case ENCODE_AND_SAVE_REQUEST:{
                draft.encodeAndSaveLoading=true;
                draft.encodeAndSaveLoaded=false;
                break;
            }
            case ENCODE_AND_SAVE_SUCCESS:{
                draft.encodeAndSaveLoading=false;
                draft.encodeAndSaveLoaded=true;
                draft.encodedStoryLine=draft.encodeStrArr.join('\n************\n');
                break;
            }
            case ENCODE_AND_SAVE_FAILURE:{
                draft.encodeAndSaveError=action.error;
                draft.encodeAndSaveLoading=false;
                break;
            }
            case LOAD_STORY_REQUEST:{
                draft.loadStoryError=null;
                draft.loadingStory=true;
                draft.loadedStory=false;
                break;
            }
            case LOAD_STORY_SUCCESS:{
                draft.loadingStory=false;
                draft.loadedStory=true;
                if(draft.creatingStory){
                    draft.createdStory=draft.createdStory.concat({
                        id:draft.creatingStory.id,
                        inputType:draft.creatingStory.inputType,
                        inputText:draft.creatingStory.inputText,
                        outputText:draft.creatingStory.outputText[draft.creatingStory.index]
                    })
                }
                draft.creatingStory=dummpyStoryLine(action.data);
                break;
            }
            case LOAD_STORY_FAILURE:{
                draft.loadStoryError=action.error;
                draft.loadingStory=false;
                break;
            }
            case CHANGE_LAST_STORY_INDEX:{
                if(action.direction==='forth'){
                    if(draft.creatingStory.index>=draft.creatingStory.outputText.length-1){
                        draft.creatingStory.index = 0;    
                    }else{
                        draft.creatingStory.index = draft.creatingStory.index+1;
                    }
                }else{
                    if(draft.creatingStory.index<=0){
                        draft.creatingStory.index = draft.creatingStory.outputText.length-1;    
                    }else{
                        draft.creatingStory.index = draft.creatingStory.index-1;
                    }
                }
                break;
            }

            case CHANGE_LAST_STORY_INDEX_REQUEST:{
                draft.newStoryLoaded=false;
                draft.newStoryLoading=true;
                draft.newStoryError=null;
                break;
            }

            case CHANGE_LAST_STORY_INDEX_SUCCESS:{
                draft.creatingStory.outputText.push(action.data);
                draft.creatingStory.index+=1;
                draft.newStoryLoaded=true;
                draft.newStoryLoading=false;
                break;
            }

            case CHANGE_LAST_STORY_INDEX_REQUEST:{
                draft.newStoryLoading=false;
                draft.newStoryError=action.data;
                break;
            }

            case CHANGE_STORYLINE:{
                const {id,outputText}=action.data;
                if(action.data?.flag){
                    draft.creatingStory.outputText[draft.creatingStory.index]=outputText;
                }else{
                    const storyToBeChanged = draft.createdStory.find(v=>v.id===id);
                    storyToBeChanged.outputText=outputText;
                }
                break;
            }

            default :break
        }
    })
}

export default reducer;