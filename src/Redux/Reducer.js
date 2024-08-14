import {
  ADD_USER_REQUEST, ADD_USER_SUCCESS, ADD_USER_FAILURE,
  FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE,
  EDIT_USER_REQUEST, EDIT_USER_SUCCESS, EDIT_USER_FAILURE,
  DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE,
  RESET_USER_RESPONSE,
} from './Actiontype';

const initialState = {
  users: [],
  loading: false,
  error: null,
  addUserResponse: null,
  editUserResponse: null,
  deleteUserResponse: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_USER_REQUEST:
      return {
        ...state,
        loading: true,
        addUserResponse: null,
        error: null,
      };
    case ADD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        addUserResponse: action.payload,
        error: null,
      };
    case ADD_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        addUserResponse: null,
      };

    case EDIT_USER_REQUEST:
      return {
        ...state,
        loading: true,
        editUserResponse: null,
        error: null,
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        editUserResponse: action.payload,
        error: null,
      };
    case EDIT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        editUserResponse: null,
      };

    case DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        deleteUserResponse: null,
        error: null,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteUserResponse: action.payload,
        error: null,
      };
    case DELETE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        deleteUserResponse: null,
      };
      case RESET_USER_RESPONSE:
      return {
        ...state,
        addUserResponse: null,
        editUserResponse: null,
        deleteUserResponse: null,
      };

    default:
      return state;
  }
};
