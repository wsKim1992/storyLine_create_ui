import produce from 'immer';
import faker from 'faker';

const initiallState={
    createdStory:[
        {
            inputType:'text'
            ,inputText:'폰트실험중...'
            ,outputText:'멀어지는 박쥐를 보고 있던 할머니는 고개를 돌려 손자 알보르를 쳐다보았다. 박쥐를 함부로 죽이면 안 된단다.  에이, 박쥐는 더럽고 불길하잖아요. 치사하기도 하구요.'},
        {
            inputType:'text'
            ,inputText:'폰트실험중...'
            ,outputText:'아, 들어가야지.  어? 잠시만…….  나에게 다가오던 우진은 내 앞에 서 있는 여자를 보고는 고개를 갸우뚱하며 걸음을 멈췄다. 아는 사이인가?'
        },
        {
            inputType:'text'
            ,inputText:'폰트실험중...'
            ,outputText:'에 서 있는 여자를 보고는 고개를 갸우뚱하며 걸음을 멈췄다. 아는 사이인가?왔어?를 말한 화자는 누구일까? 그녀는 바로 나였다.내가 말했다.  아니야, 아니야. 내가 먼저 말했잖아.'
        },
        {
            inputType:'image'
            ,inputText:[faker.image.imageUrl()]
            ,outputText:'이런 상황은 나도 처음이라 이러지도 저러지도 못하고 있었는데 뒤에서 "주하린!"하고 나를 부르는 소리가 들렸다. 뒤를 돌아보자 고등학교 동창이자 곧 결혼 예정인 남자친구 우진이 이쪽으로 걸어오고 있었다. 왔어? 안 들어가고 뭐 해? 아, 들어가야지.  어? 잠시만…….  나에게 다가오던 우진은 내 앞에 서 있는 여자를 보고는 고개를 갸우뚱하며 걸음을 멈췄다. 아는 사이인가?'
        },
    ],
    creatingStory:{
        inputType:'text',
        inputText:faker.lorem.sentence(),
        index:0,
        outputText:['안녕하세요 김우석 입니다','이 서비스는 AI 던전 한글판 입니다','많이들 사용 바랍니다!!']
    },
    loadingStory:false,
    loadedStory:false,
    loadStoryError:null
}

export const LOAD_STORY_REQUEST = 'LOAD_STORY_REQUEST';
export const LOAD_STORY_SUCCESS = 'LOAD_STORY_SUCCESS';
export const LOAD_STORY_FAILURE = 'LOAD_STORY_FAILURE';
export const CHANGE_LAST_STORY_INDEX= 'CHANGE_LAST_STORY_INDEX';

export const loadStory = (data)=>{
    return{type:LOAD_STORY_REQUEST,data}
}

const dummpyStoryLine = (data)=>{
    return{
        inputType:data.inputType,
        inputText:data.inputText,
        index:0,
        outputText:[faker.lorem.paragraph(),faker.lorem.paragraph(),faker.lorem.paragraph()]
    };
}

const reducer = (state=initiallState,action)=>{
    return produce(state,(draft)=>{
        switch (action.type){
            case LOAD_STORY_REQUEST:{
                draft.loadStoryError=null;
                draft.loadingStory=true;
                draft.loadedStory=false;
                break;
            }
            case LOAD_STORY_SUCCESS:{
                draft.loadingStory=false;
                draft.loadedStory=true;
                draft.createdStory=draft.createdStory.concat({
                    inputType:draft.creatingStory.inputType,
                    inputText:draft.creatingStory.inputText,
                    outputText:draft.creatingStory.outputText[draft.creatingStory.index]
                })
                draft.creatingStory=dummpyStoryLine(action.data);
                console.log(draft.creatingStory);
                break;
            }
            case LOAD_STORY_FAILURE:{
                draft.loadStoryError=action.error;
                draft.loadingStory=false;
                break;
            }
            case CHANGE_LAST_STORY_INDEX:{
                console.log(action.direction);
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
            default :break
        }
    })
}

export default reducer;