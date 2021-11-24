import produce from 'immer';
import faker from 'faker';

const initiallState={
    createdStory:[
        {inputType:'text',inputText:faker.lorem.sentence(),outputText:faker.lorem.paragraph()},
        {inputType:'text',inputText:faker.lorem.sentence(),outputText:faker.lorem.paragraph()},
        {inputType:'text',inputText:faker.lorem.sentence(),outputText:faker.lorem.paragraph()},
        {inputType:'image',inputText:[faker.image.imageUrl()],outputText:faker.lorem.paragraph()},
    ],
    creatingStory:{
        inputType:'text',
        inputText:faker.lorem.sentence(),
        index:0,
        outputText:[faker.lorem.paragraph(),faker.lorem.paragraph(),faker.lorem.paragraph()]
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