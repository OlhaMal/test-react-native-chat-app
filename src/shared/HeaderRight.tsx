import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../core/contactsSlice";
import { createChat, getChatById } from "../core/chatService";
import {
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import uuid from "react-native-uuid";
import { RootState, AppDispatch } from "../core/store";
import { Participant } from "../core/types";

type RootStackParamList = {
  Chat: { chatName: string };
};

const HeaderRight = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const openContactModal = useSelector(
    (state: RootState) => state.contacts.openContactModal
  );
  const contacts = useSelector(
    (state: RootState) => state.contacts.contacts
  );
  const currentUser = useSelector(
    (state: RootState) => state.contacts.currentUser
  );
  const existingChats = useSelector(
    (state: RootState) => state.chat.existingChats
  );

  const navigation =
    useNavigation<NavigationProp<RootStackParamList>>();
    
  const filteredContacts = contacts.filter(
    contact => !existingChats.includes(contact.id)
  );

  const handleButtonPress = () => {
    dispatch(toggleModal());
  };

  const createNewChat = async (contact: Participant) => {
    const newChat = {
      chatId: uuid.v4().toString(),
      chatName: contact.name,
      canDelete: true,
      participants: [
        {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
        },
        currentUser,
      ],
      messages: [],
    };

    try {
      await dispatch(createChat(newChat));
      await dispatch(getChatById(newChat.chatId));
      navigation.navigate("Chat", { chatName: newChat.chatName });
      handleButtonPress();
    } catch (error) {
      console.error("Error creating or fetching chat:", error);
    }
  };

  const renderItem = ({ item }: { item: Participant }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => createNewChat(item)}
    >
      <Image
        source={{ uri: item.avatar }}
        style={styles.contactAvatar}
      />
      <Text style={styles.contactName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleButtonPress}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <Modal
        visible={openContactModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleButtonPress}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {filteredContacts.length !== 0 ? (
              <FlatList
                data={filteredContacts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            ) : (
              <Text style={styles.noContactsText}>
                No contacts left!
              </Text>
            )}
            <Button title="Close" onPress={handleButtonPress} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 5,
  },
  button: {
    paddingBottom: 5,
    paddingHorizontal: 30,
    backgroundColor: "transparent",
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 35,
    color: "#968970",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactName: {
    fontSize: 16,
  },
  noContactsText: {
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 25,
    paddingTop: 25,
  },
});

export default HeaderRight;
