import {
  SET_DAYOFF_COUNT,
  UPDATE_DAYOFF_COUNT
} from "../actions/types";

const initState = {
  dayoffCount:'',
  dayoffCheck:false
};

const counter = (state = initState, action) => {
  switch (action.type) {
    case SET_DAYOFF_COUNT:
      return {
        ...state,
        dayoffCount: action.payload,
      };
    case UPDATE_DAYOFF_COUNT:
      return {
        ...state,
        dayoffCheck: action.payload,
      };
    default:
      return state;
  }
};

export default counter;
