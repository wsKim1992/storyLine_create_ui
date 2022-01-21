import produce from 'immer';

const initialState={
    storyData:{
        title:null,
        author:null,
        storypage_cover:null,
        movieType:'',
        pageCoverDataURL:null,
    },
    storyDataLoading:false,
    storyDataLoaded:false,
    storyDataError:null,
};

export const STORYDATA_LOAD_REQUEST = 'STORYDATA_LOAD_REQUEST';
export const STORYDATA_LOAD_SUCCESS = 'STORYDATA_LOAD_SUCCESS';
export const STORYDATA_LOAD_ERROR = 'STORYDATA_LOAD_ERROR';
export const CHANGE_GENRE = 'CHANGE_GENRE';

const reducer = (state=initialState,action)=>{
    return produce(state,(draft)=>{
        switch(action.type){
            case STORYDATA_LOAD_REQUEST:{
                draft.storyDataError=null;
                draft.storyDataLoaded=false;
                draft.storyDataLoading=true;
                break;
            }
            case STORYDATA_LOAD_SUCCESS:{
                console.log(STORYDATA_LOAD_SUCCESS);
                draft.storyDataLoading=false;
                draft.storyDataLoaded=true;
                draft.storyData.title = action.storyData?.title;
                draft.storyData.author = action.storyData?.author;
                draft.storyData.storypage_cover = action.storyData.storypage_cover;
                draft.storyData.pageCoverDataURL=action.storyData.pageCoverDataURL;
                console.log(action.storyData);
                break;
            }
            case STORYDATA_LOAD_ERROR:{
                draft.storyDataLoading=false;
                draft.storyDataError=action.errorData;
                break;
            }
            case CHANGE_GENRE:{
                draft.storyData.movieType=action.data;
                break;
            }
            default:{
                break;
            }
        }
    })
}

export default reducer;

