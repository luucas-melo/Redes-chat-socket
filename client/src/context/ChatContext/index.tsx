import { Session } from 'next-auth';
import React, { createContext, useContext, useMemo, useState } from 'react';

export type ChatContextType = {
  chat: string[];
  setChat: React.Dispatch<React.SetStateAction<string[]>>;
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatContextDefaultValues: ChatContextType = {
  chat: [],
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
  const [chat, setChat] = useState<string[]>([]);

  const values = useMemo(
    () => ({
      connected,
      setConnected,
      chat,
      setChat,
    }),
    [connected, chat, setConnected, setChat]
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
