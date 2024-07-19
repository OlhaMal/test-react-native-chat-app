import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchContacts } from "./contactsService";
import { ContactsState, Contact } from "./types";

const initialState: ContactsState = {
    contacts: [],
    openContactModal: false,
    currentUser: {
      id: "user-211-22",
      name: "Frederick Carroll",
      avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/840.jpg",
    },
  };

  const contactsSlice = createSlice({
    name: "contacts",
    initialState,
    reducers: {
      toggleModal: (state) => {
        state.openContactModal = !state.openContactModal;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
        state.contacts = action.payload;
      });
    },
  });
  
  export const { toggleModal } = contactsSlice.actions;
  
  export default contactsSlice.reducer;