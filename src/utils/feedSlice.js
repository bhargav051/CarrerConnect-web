import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      // Replace entire feed (first page load)
      return action.payload;
    },
    appendFeed: (state, action) => {
      // Append next page users
      if (!state) return action.payload;
      return [...state, ...action.payload];
    },
    removeUserFromFeed: (state, action) => {
      // Remove one user after swipe/like/dislike
      if (!state) return state;
      return state.filter((user) => user._id !== action.payload);
    },
    clearFeed: () => null,
  },
});

export const { addFeed, appendFeed, removeUserFromFeed, clearFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
