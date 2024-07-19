import React from "react";
import {
  NavigationContainer
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ChatListScreen from "../shared/ChatListScreen";
import ChatScreen from "../shared/ChatScreen";
import HeaderRight from "../shared/HeaderRight";

type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatName?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ChatList">
        <Stack.Screen
          name="ChatList"
          component={ChatListScreen}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#ddd5c6",
            },
            headerRight: () => <HeaderRight />,
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({
            title: route.params?.chatName || "Chat",
            headerStyle: {
              backgroundColor: "#ddd5c6",
            },
            headerTintColor: "#4b4538",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
