import axios from 'axios'
import {call, put, takeEvery, all, fork} from 'redux-saga/effects'
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE } from '../types'

const loginUserAPI=(loginData)=>{
    console.log(loginData, "logindata")
    const config = {
        headers: {
            "Contnet-Type": 'application/json'
        }
    }
    return axios.post('api/aut', loginData, config)
}

function* loginUser(action) {
    try {
        const result = yield call(loginUserAPI, action.payload)
        console.log(result)
        yield put ({
            type: LOGIN_SUCCESS,
            payload: result.data
        })
    } catch(e) {
        yield put({
            type: LOGIN_FAILURE,
            payload: e.response
        })
    }
}

function* watchLoginUser() {
    yield takeEvery(LOGIN_REQUEST, loginUser)
}

//Logout
function* logoutUser(action) {
    try {
        yield put ({
            type: LOGOUT_SUCCESS,
        })
    } catch(e) {
        yield put({
            type: LOGOUT_FAILURE
        })
        console.log(e)
    }
}

function* watchLogoutUser() {
    yield takeEvery(LOGOUT_REQUEST, logoutUser)
}

export default function* authSaga() {
    yield all ([
        fork(watchLoginUser),
        fork(watchLogoutUser)
    ])
}