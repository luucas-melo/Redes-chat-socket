/* eslint-disable @typescript-eslint/no-empty-function */
import { Session } from 'next-auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentChatMessages } from '../../services/messageServices';

export type ChatContextType = {
  chat: IChat[];
  currentChat: MongoUser | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<MongoUser | null>>;
  setChat: React.Dispatch<React.SetStateAction<IChat[]>>;
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatContextDefaultValues: ChatContextType = {
  chat: [],
  currentChat: null,
  setCurrentChat: () => {},
  setChat: () => {},
  connected: false,
  setConnected: () => {},
};

export const ChatContext = createContext(ChatContextDefaultValues);
ChatContext.displayName = 'ChatContext';

interface ChartProviderProps {
  children: JSX.Element;
  session: Session;
}
export const ChartProvider = ({ children, session }: ChartProviderProps) => {
  const [connected, setConnected] = useState(false);
  const [chat, setChat] = useState<IChat[]>([]);
  const [currentChat, setCurrentChat] = useState<MongoUser | null>(null);

  useEffect(() => {
    if (currentChat) getCurrentChatMessages(session?.user?._id, currentChat?._id).then((data) => setChat(data.data));
  }, [currentChat, session?.user?._id]);

  const values = useMemo(
    () => ({
      connected,
      setConnected,
      chat,
      currentChat,
      setCurrentChat,
      setChat,
    }),
    [connected, chat, currentChat, setCurrentChat, setChat, setConnected]
  );

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
}
