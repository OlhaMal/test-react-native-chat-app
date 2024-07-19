import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Contact } from "./types";

const API_URL =
  "https://fa46b77d-5946-46c8-b17a-620138fda277.mock.pstmn.io";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async () => {
    const response = await axios.get<Contact[]>(
      `${API_URL}/contacts`
    );
    return response.data;
  }
);
