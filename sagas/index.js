import {all,fork} from 'redux-saga/effects';
import storylineSaga from './storyline';

export default function* rootSaga(){
    yield all([
        fork(storylineSaga)
    ])
}