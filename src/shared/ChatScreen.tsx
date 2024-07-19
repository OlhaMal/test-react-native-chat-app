import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { updateChat } from "../core/chatService";
import { RootState, AppDispatch } from "../core/store";
import { Chat, User, Message } from "../core/types";
import webSocketService from "../core/websocketService";

const ChatScreen = () => {
  const activeChat = useSelector(
    (state: RootState) => state.chat.activeChat
  ) as Chat;
  const currentUser = useSelector(
    (state: RootState) => state.contacts.currentUser
  ) as User;
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const flatListRef = useRef<FlatList<Message>>(null);

  const hasMessages = activeChat.messages.length > 0;

  const sendMessage = () => {
    if (message.trim()) {
      webSocketService.sendMessage(
        activeChat.chatId,
        message.trim(),
        currentUser.id
      );
    }
    setMessage("");
  };

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 1);
    }
  }, [activeChat.messages, message]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <FlatList
        ref={flatListRef}
        data={hasMessages ? activeChat.messages : []}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          const isCurrentUser = item.senderId === currentUser.id;
          const avatar = isCurrentUser
            ? currentUser.avatar
            : activeChat.participants.find(
                p => p.id === item.senderId
              )?.avatar;

          return (
            <View
              style={[
                styles.messageContainer,
                isCurrentUser ? styles.right : styles.left,
              ]}
            >
              {!isCurrentUser && (
                <Image
                  source={{ uri: avatar }}
                  style={styles.avatar}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  isCurrentUser
                    ? styles.rightBubble
                    : styles.leftBubble,
                ]}
              >
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.timestamp}>
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              {isCurrentUser && (
                <Image
                  source={{ uri: avatar }}
                  style={styles.avatar}
                />
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No messages yet</Text>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={styles.sendButton}
        >
          <Text style={styles.sendButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f0eb",
  },
  messageContainer: {
    flexDirection: "row",
    margin: 10,
    alignItems: "flex-end",
  },
  left: {
    justifyContent: "flex-start",
  },
  right: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 6,
  },
  leftBubble: {
    backgroundColor: "#a1957e",
    borderBottomLeftRadius: 0,
  },
  rightBubble: {
    backgroundColor: "#4b4538",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  messageText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 10,
    color: "#fff",
    opacity: 0.8,
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#4b4438",
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  textInput: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "#968970",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default ChatScreen;
