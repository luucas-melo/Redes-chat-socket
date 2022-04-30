import { Avatar, Flex, Text, WrapItem } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useChat } from '../../context/ChatContext';
interface SidebarProps {
  session: Session;
  following: MongoUser[];
}
export const Sidebar = ({ session, following }: SidebarProps) => {
  const { setCurrentChat } = useChat();

  return (
    <Flex width="100%" flexDirection="column" overflowY="scroll">
      <Flex borderBottomWidth="1px" padding={4} alignItems="center" gap="1rem" cursor="pointer" bg="gray.100">
        <Avatar name="following user" src={session?.user?.avatar_url} />
      </Flex>
      {following?.length
        ? following.map((user, index) => (
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
              <Avatar name="following user" src={user?.avatar_url} />
              <Flex flexDirection="column">
                <Text fontWeight="semibold">{user?.login}</Text>
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
