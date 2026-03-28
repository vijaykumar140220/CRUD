// Function to check if session is still valid (under 10 mins)
const getValidToken = () => {
  const token = localStorage.getItem('token');
  const loginTimestamp = localStorage.getItem('loginTimestamp');
  
  if (!token || !loginTimestamp) return null;

  const currentTime = new Date().getTime();
  const tenMinutes = 10 * 60 * 1000; // 600,000 milliseconds

  if (currentTime - parseInt(loginTimestamp) > tenMinutes) {
    // Session expired
    localStorage.removeItem('token');
    localStorage.removeItem('loginTimestamp');
    return null;
  }
  return token;
};

const initialToken = getValidToken();

const initialState = {
  token: initialToken,
  isAuthenticated: !!initialToken,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        token: action.payload, 
        isAuthenticated: true 
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('loginTimestamp');
      return { ...state, token: null, isAuthenticated: false };
    default:
      return state;
  }
};

export default authReducer;