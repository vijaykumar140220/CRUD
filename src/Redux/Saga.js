import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  addUserSuccess, addUserFailure, fetchUsersSuccess, fetchUsersFailure,
  editUserSuccess, editUserFailure, deleteUserSuccess, deleteUserFailure,
} from './Action';
import {
  ADD_USER_REQUEST, FETCH_USERS_REQUEST, EDIT_USER_REQUEST, DELETE_USER_REQUEST
} from './Actiontype';

const API_URL = 'http://localhost:5000/crud-operations';

function* fetchUsersSaga() {
  try {
    const response = yield call(axios.get, API_URL);
    yield put(fetchUsersSuccess(response.data));
  } catch (error) {
    console.error('Error fetching users:', error);
    yield put(fetchUsersFailure(error.response ? error.response.data : error.message));
  }
}

function* addUserSaga(action) {
  try {
    const response = yield call(axios.post, API_URL, action.payload);
    yield put(addUserSuccess(response.data));
  } catch (error) {
    console.error('Error adding user:', error);
    yield put(addUserFailure(error.response ? error.response.data : error.message));
  }
}

function* editUserSaga(action) {
  try {
    const response = yield call(axios.put, `${API_URL}/${action.payload.id}`, action.payload);
    yield put(editUserSuccess(response.data));
  } catch (error) {
    console.error('Error editing user:', error);
    yield put(editUserFailure(error.response ? error.response.data : error.message));
  }
}

function* deleteUserSaga(action) {
  try {
    yield call(axios.delete, `${API_URL}/${action.payload}`);
    yield put(deleteUserSuccess(action.payload));
  } catch (error) {
    console.error('Error deleting user:', error);
    yield put(deleteUserFailure(error.response ? error.response.data : error.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(ADD_USER_REQUEST, addUserSaga);
  yield takeLatest(EDIT_USER_REQUEST, editUserSaga);
  yield takeLatest(DELETE_USER_REQUEST, deleteUserSaga);
}
