export interface Participant {
  id: string;
  name: string;
  avatar: string;
}

export type Contact = Participant;
export type User = Participant;

export interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

export interface Chat {
  chatId: string;
  chatName: string;
  canDelete: boolean;
  participants: Participant[];
  messages: Message[];
}

export type ExistingChats = string[];

export interface ChatState {
  existingChats: ExistingChats;
  chats: Chat[];
  activeChat: Chat | null;
  loading: boolean;
}

export interface ContactsState {
    contacts: Contact[];
    openContactModal: boolean;
    currentUser: User;
  }

  export interface RootState {
    chat: ChatState;
    contacts: ContactsState;
  }