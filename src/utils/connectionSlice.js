import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: 'connection',
    initialState: null,
    reducers: {
        addConnections: (state, action) => {
            return action.payload;   // ✅ Correct usage of action
        },
        removeConnections: (state, action) => {
            const newArray = state.filter((conn) => conn._id != action.payload);
            return newArray;
        },
        clearConnections: (state, action) => {
            return null;
        }
    },
});

export const { addConnections, removeConnections, clearConnections } = connectionSlice.actions;

export default connectionSlice.reducer;
