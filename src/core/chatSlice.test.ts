import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchChats, createChat } from "./chatService";
import chatReducer from "./chatSlice";
import { Chat, ExistingChats, ChatState } from "./types";

const initialState: ChatState = {
  existingChats: [],
  chats: [],
  activeChat: null,
  loading: false,
};

describe("chat slice", () => {
  it("should handle fetchChats.fulfilled", () => {
    const existingChats: ExistingChats = ["chat1", "chat2"];
    const chats: Chat[] = [
      {
        chatId: "chat1",
        chatName: "Chat 1",
        canDelete: true,
        participants: [],
        messages: [],
      },
      {
        chatId: "chat2",
        chatName: "Chat 2",
        canDelete: true,
        participants: [],
        messages: [],
      },
    ];

    const action = {
      type: fetchChats.fulfilled.type,
      payload: { existingChats, chats },
    };

    const state = chatReducer(initialState, action);

    expect(state.existingChats).toEqual(existingChats);
    expect(state.chats).toEqual(chats);
  });

  it("should handle createChat.fulfilled", () => {
    const newChat: Chat = {
      chatId: "chat3",
      chatName: "Chat 3",
      canDelete: true,
      participants: [
        {
          id: "user-211-22",
          name: "Frederick Carroll",
          avatar: "avatar-url",
        },
        { id: "user-123", name: "John Wick", avatar: "avatar-url-2" },
      ],
      messages: [],
    };
    const participantId = "user-123";

    const action = {
      type: createChat.fulfilled.type,
      payload: { newChat, participantId },
    };

    const state = chatReducer(initialState, action);

    expect(state.chats).toHaveLength(1);
    expect(state.chats[0]).toEqual(newChat);
    expect(state.existingChats).toContain(participantId);
  });
});
