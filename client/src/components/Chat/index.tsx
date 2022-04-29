import { Avatar, Flex, Input, Text, WrapItem } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { io } from 'socket.io-client';
import { useChat } from '../../context/ChatContext';
import { addNewMessage, IMessage } from '../../services/messageServices';
export const Chat = ({ session }: { session: Session }) => {
  const { handleSubmit, register, reset } = useForm<IMessage>();

  const socket = useRef();
  const { chat, connected, setConnected, setChat, currentChat } = useChat();

  const onSubmit = async (data: IMessage) => {
    if (!currentChat) return;
    try {
      socket.current.emit('SEND_MSG', {
        from: session.user.login,
        to: currentChat?.login,
        message: data.message,
      });

      const messageObject = {
        message: data.message,
        from: session?.user?.login,
        to: currentChat?.login,
      };
      const response = await addNewMessage(messageObject);
      chat.push(messageObject);
      setChat([...chat]);
      return response?.data;
    } catch (error) {
      console.log(error);
    } finally {
      reset();
    }
  };

  useEffect(() => {
    if (session?.user?.login) {
      socket.current = io('http://localhost:5000');
      socket.current.emit('ADD_USER', session?.user?.login);
      setConnected(true);
    }
  }, [session?.user?.login]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('RECEIVE_MSG', (msg: IChat) => {
        console.log('MEE', msg);
        chat.push(msg);
        setChat([...chat]);
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection="column" background="gray.50" maxH="100vh" height="calc(100% - 40px)" overflowY="scroll">
        {currentChat && (
          <>
            <Flex borderBottomWidth="1px" padding={4} alignItems="center" gap="1rem" cursor="pointer">
              <Avatar name="usuário logado" src={currentChat?.avatar_url} />
              <Flex flexDirection="column">
                <Text fontWeight="semibold">{currentChat?.login}</Text>
                <Text fontSize="small" fontWeight="light">
                  status
                </Text>
              </Flex>
            </Flex>
          </>
        )}
        {chat.map((chatData, index) => {
          console.log(session?.user?.login, chatData);

          return (
            <Flex flexDirection="column" key={index} padding="10" paddingTop="0">
              <Flex flexDirection="column" marginLeft={session?.user?.login === chatData.from ? 'auto' : '0'}>
                <Text
                  minWidth="50px"
                  bg={session?.user?.login === chatData.from ? 'whatsapp.100' : 'white'}
                  width="fit-content"
                  borderRadius="md"
                  padding="1"
                >
                  {chatData.message}
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
