import { Flex, Input, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { io } from 'socket.io-client';
import { useChat } from '../../context/ChatContext';
import { addNewMessage, IMessage } from '../../services/messageServices';
export const Chat = ({ session }: { session: Session }) => {
  const { handleSubmit, register, reset } = useForm<IMessage>();

  const socket = useRef();
  const { chat, connected, setChat, currentChat } = useChat();

  const onSubmit = async (data: IMessage) => {
    if (!currentChat) return;
    try {
      socket.current.emit('SEND_MSG', {
        to: currentChat?.login,
        from: session.user.login,
        message: data.message,
      });
      const response = await addNewMessage({
        message: data.message,
        from: session?.user?.login,
        to: currentChat?.login,
      });
      chat.push(data.message);
      setChat([...chat]);
      return response?.data;
    } catch (error) {
      console.log(error);
    } finally {
      reset();
    }
  };

  useEffect(() => {
    console.log(session?.user);
    if (session?.user?.login) {
      socket.current = io('http://localhost:5000');
      socket.current.emit('ADD_USER', session?.user?.login);
    }
  }, [session?.user?.login]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('RECEIVE_MSG', (msg: string) => {
        chat.push(msg);
        setChat([...chat]);
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection="column" background="gray.50" maxH="100vh" height="calc(100% - 40px)" overflowY="scroll">
        {chat.map((message, index) => {
          return (
            <Flex flexDirection="column" key={index} padding="10" paddingTop="0">
              <Flex flexDirection="column" marginLeft={session?.user?.login === message.user ? 'auto' : '0'}>
                {session?.user?.login !== message.user && <Text fontSize="smaller">{message.user}</Text>}
                <Text
                  minWidth="50px"
                  bg={session?.user?.login === message.user ? 'whatsapp.100' : 'white'}
                  width="fit-content"
                  borderRadius="md"
                  padding="1"
                >
                  {message}
                </Text>
              </Flex>
            </Flex>
          );
        })}
        <Flex position="fixed" bottom="0" width="100%">
          <Input
            autoComplete="off"
            {...register('message')}
            color="black.400"
            placeholder={connected ? 'Mensagem' : 'Conectando...'}
            _placeholder={{ color: 'gray.400' }}
          />
        </Flex>
      </Flex>
    </form>
  );
};
