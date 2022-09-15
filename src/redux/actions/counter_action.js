import { SET_DAYOFF_COUNT, UPDATE_DAYOFF_COUNT } from "./types";

export const setDayoffCount = (count) => {
  return {
    type: SET_DAYOFF_COUNT,
    payload: count,
  };
};
export const updateDayoffCount = (chk) => {
  return {
    type: UPDATE_DAYOFF_COUNT,
    payload: chk,
  };
};
