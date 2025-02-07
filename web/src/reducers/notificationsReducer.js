const initialState = {
    notifications: [],
    unreadCount: 0,
  };
  
  export const notificationsReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_NOTIFICATIONS":
        return {
          ...state,
          notifications: action.payload,
          unreadCount: action.payload.filter((n) => !n.is_read).length,
        };
  
      case "MARK_AS_READ":
        return {
          ...state,
          notifications: state.notifications.map((n) =>
            n.id === action.payload ? { ...n, is_read: true } : n
          ),
          unreadCount: state.notifications.filter((n) => !n.is_read).length - 1,
        };
  
      case "MARK_ALL_AS_READ":
        return {
          ...state,
          notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
          unreadCount: 0,
        };
  
      default:
        return state;
    }
  };
  