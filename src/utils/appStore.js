import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // ✅ correct name

const appStore = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default appStore;
