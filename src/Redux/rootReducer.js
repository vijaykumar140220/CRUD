import { combineReducers } from 'redux';
import { userReducer } from './Reducer'; 
import authReducer from './authReducer'; // Import the new reducer

const rootReducer = combineReducers({
  user: userReducer, 
  auth: authReducer, // This name "auth" MUST match your ProtectedRoute
});

export default rootReducer;