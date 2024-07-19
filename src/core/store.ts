import { configureStore, combineReducers } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import contactsReducer from "./contactsSlice";

const rootReducer = combineReducers({
  chat: chatReducer,
  contacts: contactsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;