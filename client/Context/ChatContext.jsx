import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // -----------------------------
  // Get all users for sidebar
  // -----------------------------
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/message/users");
      if (data) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // -----------------------------
  // Get messages for selected user
  // -----------------------------
  const getMessages = async (userId) => {
    if (!userId) return;

    try {
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // -----------------------------
  // Send message to selected user
  // -----------------------------
  const sendMessage = async (messageData) => {
    if (!selectedUser) return;

    try {
      const { data } = await axios.post(
        `/api/message/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
        // Emit to socket for real-time delivery
        socket?.emit("sendMessage", data.newMessage);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // -----------------------------
  // Real-time message subscription
  // -----------------------------
  useEffect(() => {
    if (!socket) return;

    const handler = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/message/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
    };
  }, [socket, selectedUser]);

  // -----------------------------
  // Context value
  // -----------------------------
  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
  };

  return <ChatContext.Provider 
        value={value}>{children}
    </ChatContext.Provider>;
};