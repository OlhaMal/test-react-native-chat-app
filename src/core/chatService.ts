import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Message, Chat } from "./types";

const API_URL =
  "https://fa46b77d-5946-46c8-b17a-620138fda277.mock.pstmn.io";

export const createChat = createAsyncThunk(
  "chat/createChat",
  async (newChat: Chat) => {
    const participantId =
      newChat.participants.find(
        participant => participant.id !== "user-211-22"
      )?.id || "";
    await axios.post(`${API_URL}/chats`);
    return { newChat, participantId };
  }
);

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async () => {
    const response = await axios.get(`${API_URL}/chats`);
    return response.data;
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chat: { chatId: string; participantId: string }) => {
    await axios.delete(`${API_URL}/chats/xxx`);
    return chat;
  }
);

export const updateChat = createAsyncThunk(
  "chat/updateChat",
  async (updateMes: { chatId: string; message: Message }) => {
    await axios.put(`${API_URL}/chats/xxx`);
    return updateMes;
  }
);

export const getChatById = createAsyncThunk(
  "chat/getChatById",
  async (chatId: string) => {
    await axios.get(`${API_URL}/chats/xx`);
    return chatId;
  }
);
