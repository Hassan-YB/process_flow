import { USER_SIGNUP, USER_VERIFY_OTP, 
  USER_LOGIN, CHANGE_PASSWORD, 
  RESEND_OTP_SUCCESS , LOGOUT_SUCCESS} 
from '../actions/userActions';

const initialState = {
  user: null,
  isLoggedIn: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGNUP:
      return { ...state, user: action.payload };
    case USER_VERIFY_OTP:
      return { ...state, user: { ...state.user, ...action.payload } };
    case RESEND_OTP_SUCCESS:
      return {
        ...state,
        otpResend: action.payload,
      };
      
    case USER_LOGIN:
      return { ...state, isLoggedIn: true, user: action.payload };

      case LOGOUT_SUCCESS:
        return {
          ...state,
          user: null,
          isLoggedIn: false,
        };
      
    case CHANGE_PASSWORD:
      return { ...state, user: { ...state.user, passwordChanged: true } };
    default:
      return state;
  }
};
