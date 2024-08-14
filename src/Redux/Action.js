import { type } from '@testing-library/user-event/dist/type';
import {
  ADD_USER_REQUEST, ADD_USER_SUCCESS, ADD_USER_FAILURE,
  FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE,
  EDIT_USER_REQUEST, EDIT_USER_SUCCESS, EDIT_USER_FAILURE,
  DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE,
  RESET_USER_RESPONSE,
} from './Actiontype';

// Add User
export const addUserRequest = (user) => ({
  type: ADD_USER_REQUEST,
  payload: user,
});

export const addUserSuccess = (user) => ({
  type: ADD_USER_SUCCESS,
  payload: user,
});

export const addUserFailure = (error) => ({
  type: ADD_USER_FAILURE,
  payload: error,
});

// Fetch Users
export const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST,
});

export const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});

export const fetchUsersFailure = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

// Edit User
export const editUserRequest = (user) => ({
  type: EDIT_USER_REQUEST,
  payload: user,
});

export const editUserSuccess = (user) => ({
  type: EDIT_USER_SUCCESS,
  payload: user,
});

export const editUserFailure = (error) => ({
  type: EDIT_USER_FAILURE,
  payload: error,
});

// Delete User
export const deleteUserRequest = (id) => ({
  type: DELETE_USER_REQUEST,
  payload: id,
});

export const deleteUserSuccess = (id) => ({
  type: DELETE_USER_SUCCESS,
  payload: id,
});

export const deleteUserFailure = (error) => ({
  type: DELETE_USER_FAILURE,
  payload: error,
});


export const resetUserResponse= () => ({
  type: RESET_USER_RESPONSE
})
