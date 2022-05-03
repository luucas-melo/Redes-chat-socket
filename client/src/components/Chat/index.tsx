import { Avatar, Flex, Input, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { io } from 'socket.io-client';
import { useChat } from '../../context/ChatContext';
import { IGroup } from '../../services/groupServices';
import { addNewMessage } from '../../services/messageServices';
import { IMessage } from '../../services/usersServices';
export const Chat = ({ session }: { session: Session }) => {
  const { handleSubmit, register, reset } = useForm<IMessage>();

  const { chat, connected, setConnected, setChat, currentChat, socket } = useChat();
  const [messageReceived, setMessageReceived] = useState<IChat>();
  const onSubmit = async (data: IMessage) => {
    if (!currentChat) return;
    try {
      const messageObject = {
        message: data.message,
        from: session?.user,
        to: currentChat?._id,
        isPrivate: currentChat?.isPrivate,
      };
      socket.current.emit('SEND_MSG', currentChat._id, messageObject);

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
    if (session?.user?._id) {
      socket.current = io('http://localhost:5000');
      socket.current.emit('ADD_USER', session?.user?._id);
      setConnected(true);
    }
  }, [session?.user?._id, setConnected]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('RECEIVE_MSG', (msg: IChat) => {
        console.log('M,AIS', chat, msg);
        setMessageReceived(msg);
      });
    }
  }, []);

  useEffect(() => {
    messageReceived && setChat((prev) => [...prev, messageReceived]);
  }, [messageReceived]);

  useEffect(() => {
    console.log('O CHAT', chat);
  }, [chat]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection="column" background="gray.50" maxH="100vh" height="calc(100% - 40px)" overflowY="scroll">
        {currentChat && (
          <>
            <Flex
              borderBottomWidth="1px"
              padding={4}
              alignItems="center"
              gap="1rem"
              cursor="pointer"
              position="sticky"
              top={0}
              right={0}
              width="100%"
              bg="gray.100"
            >
              <Avatar name="Grupo" src={(currentChat as MongoUser)?.avatar_url} />
              <Flex flexDirection="column">
                <Text fontWeight="semibold">{(currentChat as MongoUser)?.username || currentChat?.name}</Text>
                <Text fontSize="small" fontWeight="light">
                  {(currentChat as IGroup)?.users?.map((user) => user.username)}
                </Text>
              </Flex>
            </Flex>
          </>
        )}
        {chat?.length > 0
          ? chat.map((chatData, index) => {
              return (
                <Flex flexDirection="column" key={index} padding="10" paddingTop="0">
                  <Flex flexDirection="column" marginLeft={session?.user?._id === chatData.from._id ? 'auto' : '0'}>
                    {session?.user?._id !== chatData?.from?._id ? (
                      <Text fontSize="small">{chatData?.from?.username}</Text>
                    ) : null}
                    <Text
                      minWidth="50px"
                      bg={session?.user?._id === chatData.from?._id ? 'whatsapp.100' : 'white'}
                      width="fit-content"
                      borderRadius="md"
                      padding="1"
                    >
                      {chatData.message}
                    </Text>
                  </Flex>
                </Flex>
              );
            })
          : null}
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
