import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";

import {
  deleteChat,
  getChatById,
  fetchChats,
} from "../core/chatService";
import { fetchContacts } from "../core/contactsService";
import { RootState, AppDispatch } from "../core/store";
import { Chat, Participant} from "../core/types";

type RootStackParamList = {
  Chat: { chatName: string };
};

const ChatListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const navigation =
    useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    dispatch(fetchChats());
    dispatch(fetchContacts());
  }, [dispatch]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Chat | null>(null);

  const handlePress = async (item: Chat) => {
    await dispatch(getChatById(item.chatId));
    navigation.navigate("Chat", { chatName: item.chatName });
  };

  const handleLongPress = (item: Chat) => {
    if (item.canDelete) {
      setItemToDelete(item);
      setIsModalVisible(true);
    }
  };

  const handleDelete = () => {
    if (itemToDelete) {
      const chat = {
        chatId: itemToDelete.chatId,
        participantId:
          itemToDelete.participants.find(
            (participant: Participant) =>
              participant.id !== "user-211-22"
          )?.id || "",
      };
      dispatch(deleteChat(chat));
      setIsModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const renderItem = ({ item }: { item: Chat }) => {
    const participant = item.participants.find(
      (participant: Participant) => participant.id !== "user-211-22"
    );

    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item)}
      >
        <Image
          source={{ uri: participant?.avatar }}
          style={styles.contactAvatar}
        />
        <View style={styles.messageWrapper}>
          <Text style={styles.contactName}>{participant?.name}</Text>
          {item.messages.length !== 0 ? (
            <Text style={styles.message}>
              {item.messages[item.messages.length - 1].message}
            </Text>
          ) : (
            <Text style={styles.message}>No messages yet</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={item => item.chatId}
      />

      {isModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Are you sure you want to delete this chat?
              </Text>
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={handleCancel} />
                <Button title="Delete" onPress={handleDelete} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f3f0eb",
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
    paddingBottom: 6,
    fontWeight: "bold",
  },
  message: {
    fontSize: 12,
  },
  messageWrapper: {
    paddingHorizontal: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    paddingBottom: 25,
    paddingTop: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 30,
  },
});

export default ChatListScreen;
