import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createChat,
  fetchChats,
  deleteChat,
  updateChat,
  getChatById,
} from "./chatService";
import { Chat, ChatState, ExistingChats, Message } from "./types";

const initialState: ChatState = {
  existingChats: [],
  chats: [],
  activeChat: null,
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        fetchChats.fulfilled,
        (
          state,
          action: PayloadAction<{
            existingChats: ExistingChats;
            chats: Chat[];
          }>
        ) => {
          state.existingChats = action.payload.existingChats;
          state.chats = action.payload.chats;
        }
      )
      .addCase(
        createChat.fulfilled,
        (
          state,
          action: PayloadAction<{
            newChat: Chat;
            participantId: string;
          }>
        ) => {
          const { newChat, participantId } = action.payload;
          state.chats.unshift(newChat);
          state.existingChats.push(participantId);
        }
      )
      .addCase(
        deleteChat.fulfilled,
        (
          state,
          action: PayloadAction<{
            chatId: string;
            participantId: string;
          }>
        ) => {
          const { chatId, participantId } = action.payload;
          state.chats = state.chats.filter(
            chat => chat.chatId !== chatId
          );
          state.existingChats = state.existingChats.filter(
            id => id !== participantId
          );
        }
      )
      .addCase(
        updateChat.fulfilled,
        (
          state,
          action: PayloadAction<{ chatId: string; message: Message }>
        ) => {
          const { chatId, message } = action.payload;

          const chatToUpdate = state.chats.find(
            chat => chat.chatId === chatId
          );
          if (chatToUpdate) {
            const updatedChat: Chat = {
              ...chatToUpdate,
              messages: [...chatToUpdate.messages, message],
            };

            state.chats = state.chats.map(chat =>
              chat.chatId === chatId ? updatedChat : chat
            );
          }
          if (
            state.activeChat &&
            state.activeChat.chatId === chatId
          ) {
            state.activeChat.messages = [
              ...state.activeChat.messages,
              message,
            ];
          }
        }
      )
      .addCase(getChatById.fulfilled, (state, action) => {
        const newActiveChat = state.chats.find(
          chat => chat.chatId === action.payload
        );
        state.activeChat = newActiveChat || null;
      });
  },
});

export default chatSlice.reducer;
