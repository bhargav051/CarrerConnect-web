import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: 'feed',
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        removeUserFromFeed: (state, action) => {
            if (!state) return state;
            const newFeed = state.filter((user) => user._id != action.payload);
            return newFeed;
        },
        // reset feed (used on logout or when you want to refresh)
        clearFeed: (state, action) => {
            return null;
        }
    },
});

export const { addFeed, removeUserFromFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;