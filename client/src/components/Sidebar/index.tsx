import { Avatar, Flex, Text, WrapItem } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useChat } from '../../context/ChatContext';
interface SidebarProps {
  session: Session;
  following: IUser[];
}
export const Sidebar = ({ session, following }: SidebarProps) => {
  const { setCurrentChat, currentChat, chat } = useChat();

  console.log(chat, currentChat);
  return (
    <Flex width="100%" flexDirection="column" overflowY="scroll">
      <Flex bg="white" height="fit-content" width="100%" padding="3" justify="space-between" alignItems="center">
        <WrapItem>
          <Avatar name="usuário logado" src={session?.user?.avatar_url} />
        </WrapItem>
      </Flex>
      {following?.length &&
        following.map((user, index) => (
          <Flex
            key={index}
            borderBottomWidth="1px"
            padding={4}
            alignItems="center"
            gap="1rem"
            cursor="pointer"
            _hover={{ backgroundColor: 'gray.100' }}
            onClick={() => setCurrentChat(user)}
          >
            <Avatar name="usuário logado" src={user?.avatar_url} />
            <Flex flexDirection="column">
              <Text fontWeight="semibold">{user?.login}</Text>
              <Text fontSize="small" fontWeight="light">
                Ultima mensagem
              </Text>
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};
