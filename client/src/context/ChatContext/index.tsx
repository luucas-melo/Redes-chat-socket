/* eslint-disable @typescript-eslint/no-empty-function */
import { Session } from 'next-auth';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { IGroup } from '../../services/groupServices';
import { getMessages } from '../../services/messageServices';

export type ChatContextType = {
  chat: IChat[];
  currentChat: MongoUser | IGroup | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<MongoUser | IGroup | null>>;
  setChat: React.Dispatch<React.SetStateAction<IChat[]>>;
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  socket?: React.MutableRefObject<undefined>;
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
  const [chat, setChat] = useState<IChat[]>();
  const [currentChat, setCurrentChat] = useState<MongoUser | IGroup | null>(null);

  useEffect(() => {
    console.log('TESTANDO', currentChat);
    if (!currentChat?._id || !session?.user?._id) return;
    getMessages(session?.user?._id, currentChat?._id as string).then((data) => {
      const messages = data?.data?.messages.map((message) => {
        return {
          from: message.sender,
          message: message.message.text,
        };
      });
      console.log('MESSAGES', messages);
      setChat(messages);
    });
  }, [currentChat, session?.user?._id]);

  const socket = useRef();

  const values = useMemo(
    () => ({
      connected,
      setConnected,
      chat,
      currentChat,
      setCurrentChat,
      setChat,
      socket,
    }),
    [connected, chat, currentChat, setCurrentChat, setChat, setConnected, socket]
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
