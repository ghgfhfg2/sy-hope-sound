import { HYDRATE } from "next-redux-wrapper";
import user from "./user_reducer";
import counter from "./counter_reducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        return {
          ...state,
          ...action.payload,
        };

      default:
        return state;
    }
  },
  user,counter
});

export default rootReducer;
