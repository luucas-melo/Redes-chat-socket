import { Avatar, Flex, WrapItem } from '@chakra-ui/react';
import { Session } from 'next-auth';
export const Sidebar = ({ session }: { session: Session }) => {
  return (
    <Flex bg="gray.200" width="100%" flexDirection="column">
      <Flex bg="white" height="fit-content" width="100%" padding="3" justify="space-between" alignItems="center">
        <WrapItem>
          <Avatar name="usuário logado" src={session?.user?.avatar_url} />
        </WrapItem>
      </Flex>
    </Flex>
  );
};
