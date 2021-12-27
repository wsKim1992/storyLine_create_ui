import { combineReducers } from "redux";
import storyline from './storyline';
import storyData from './storyData';

const rootReducer= combineReducers({
    storyline,
    storyData,
})

export default rootReducer;