import { Avatar, Flex, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useChat } from '../../context/ChatContext';
interface SidebarProps {
  session: Session;
  users: MongoUser[];
}
export const Sidebar = ({ session, users }: SidebarProps) => {
  const { setCurrentChat } = useChat();
  return (
    <Flex width="100%" flexDirection="column" overflowY="scroll">
      <Flex borderBottomWidth="1px" padding={4} alignItems="center" gap="1rem" cursor="pointer" bg="gray.100">
        <Avatar name="following user" src={session?.user?.avatar_url} />
      </Flex>
      {users?.length
        ? users.map((user, index) => (
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
              <Avatar name="user" src={user?.avatar_url} />
              <Flex flexDirection="column">
                <Text fontWeight="semibold">{user?.username}</Text>
                <Text fontSize="small" fontWeight="light">
                  Ultima mensagem
                </Text>
              </Flex>
            </Flex>
          ))
        : null}
    </Flex>
  );
};
