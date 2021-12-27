import produce from 'immer';
import faker from 'faker';

const initiallState={
    createdStory:[
        {
            id:12121621
            ,inputType:'text'
            ,inputText:['헨젤과 그레텔 외전','일곱 살 현정이와 다섯 살 가람이는 외로운 남매였다. 두 남매의 부모는 자기 하나 앞가림하기 힘든 철없고 어린 부부였다. 자식인 현정이와 가람이를 책임지고 건사할 능력도 의욕도 떨어진지 오래였고, 늘 가난에 허덕였다. 어느새 부부는 술과 게임으로 도피했다. 얼마 남지 않은 생활비를 또다시 술과 게임 아이템을 사는 데에 탕진한 부부는 눈이 마주치자마자 싸움을 벌였다. 부모의 싸움에 이골이 난 현정과 가람은 늘 그랬듯 좁은 방으로 도망쳐 조용히 서로의 귀를 막아주었다. ']
            ,outputText:'다음날 부부는 소풍을 위해 가방을 들고 집을 나서고, 현정과 가람은 거실에 고양이 귀가 달린 그릇에 집 열쇠를 두고 부모를 따라 집을 나섰다. 그렇게 좁고 더러웠지만 그래도 유일한 안식처였던 집을 뒤로 하고, 그들을 버리려는 부모를 따라 산으로 올라간다. 숲속으로 가 가족끼리 행복한 시간을 보내는 척 하던 부부는 조용히 현정과 가람이를 두고 사라진다. 현정이와 가람이는 부모가 자신들을 두고 사라지는 것을 알지만 눈물을 참으며 모른 척 한다. '
        },
        {
            id:12345678,
            inputType:'text'
            ,inputText:'한동안 방황해 온 현정과 가람은 피곤해 길을 잃는다. 그들은 아무것도 먹지 않았기 때문에 배가 고팠고, 낯선 사람들을 두려워했기 때문에 매우 고통스러웠다. 어두운 골목에 숨어 있던 현정과 가람은 쓰레기통에서 발견한 빵 등 물건들을 먹으며 낯선 사람들을 무서워해 달아났다.'
            ,outputText:'그들은 도시를 돌아다녔고, 낯선 사람들로부터 도망치고 있었다. 그러다 현정과 가람은 이상한 모자를 쓰고 있던 낯선 남자를 보았다. 그는 마술사였다. '
        },
        {
            id:14321234,
            inputType:'image'
            ,inputText:'/assets/img/sampleImg.png'
            ,outputText:'부모에게 버림받은 현정과 가람은 그를 겁내하며 도움을 받고 싶지 않다고 말했다. 충격을 받은 마술사는 자신이 나쁜 마술사가 아니라고 말했다. 그들은 마침내 마법학교처럼 보이는 곳에 도착했고, 마술사가 좋은 사람이라는 것을 알게 된 현정과 가람은 마술사를 따라 건물 안으로 들어갔다. '
        }
    ],
    creatingStory:{
        id:23454122,
        inputType:'text',
        inputText:'마술사가 잠시 자리를 비운 사이 사무실에 남겨진 현정과 가람은 다시 버림받을까 봐 걱정하다가 기다리는 동안 울었다. 다시 돌아온 마술사는 자신이 나쁘지 않으며 그들을 돌볼 것이라고 말했다. ',
        index:0,
        storyMode:'story',
        outputText:['그는 그들이 다시는 그런 고통을 겪지 않도록 하겠다고 약속했고, 또한 결코 그들을 떠나지 않겠다고 약속했다. 앞으로 어떻게 될지 걱정하던 현정과 가람은 앞으로 그들을 돌보겠다고 약속한 마술사와 함께 지내기로 했다.'],
        nextOutputArr:[],
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
    showEntireStory:false,
    editEntireStory:false,
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
export const SHOW_ENTIRE_STORY = 'SHOW_ENTIRE_STORY';
export const EDIT_ENTIRE_STORY = 'EDIT_ENTIRE_STORY';
export const INIT_REQUEST = 'INIT_REQUEST'

export const loadStory = (data)=>{
    return{type:LOAD_STORY_REQUEST,data}
}

const reducer = (state=initiallState,action)=>{
    return produce(state,(draft)=>{
        switch (action.type){
            case INIT_REQUEST:{
                if(draft.decodeAndUploadLoading||draft.loadingStory||draft.newStoryLoading||draft.showEntireStory){
                    break;
                }else{
                    draft.createdStory=[];
                    draft.creatingStory=null;
                }
                break;
            }
            case EDIT_ENTIRE_STORY:{
                draft.editEntireStory=!draft.editEntireStory;
                break;
            }
            case SHOW_ENTIRE_STORY:{
                draft.showEntireStory=!draft.showEntireStory;
                break;
            }
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
                if(draft.creatingStory){
                    draft.createdStory=draft.createdStory.concat({
                        id:draft.creatingStory.id,
                        inputType:draft.creatingStory.inputType,
                        inputText:draft.creatingStory.inputText,
                        outputText:draft.creatingStory.outputText[draft.creatingStory.index]
                    })
                }
                draft.creatingStory={
                    id:Date.now(),
                    inputType:action.data.inputType,
                    inputText:action.data.isInputEqualsOutput?null:action.data.inputText,
                    storyMode:action.data.storyMode,
                    index:0,
                    outputText:[''],
                }
                break;
            }
            case LOAD_STORY_SUCCESS:{
                draft.loadingStory=false;
                draft.loadedStory=true;
                draft.creatingStory={...state.creatingStory,outputText:state.creatingStory.storyMode==='talk'?[...action.data.outputText]:[action.data.outputText]};
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
                if(!action.isOutput){
                    console.log(action.data);
                    draft.creatingStory.outputText.push(action.data);
                }else{
                    draft.creatingStory.nextOutputText = action.data;
                }
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