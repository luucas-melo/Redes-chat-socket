import { Avatar, Button, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Select, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useChat } from '../../context/ChatContext';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createGroup, IGroup } from '../../services/groupServices';
import { toast } from 'react-toastify';
interface SidebarProps {
  session: Session;
  users: MongoUser[];
  groups: IGroup[];
}
export const Sidebar = ({ session, users, groups }: SidebarProps) => {
  const { setCurrentChat, socket, currentChat } = useChat();
  const [groupMembers, setGroupMembers] = useState<MongoUser['_id'][]>([]);

  interface FormValues {
    groupName: string;
  }

  interface AddFriendFormValues {
    userId: string;
  }

  useEffect(() => {
    if (socket?.current) {
      groups.forEach((group) => {
        socket?.current.emit('ADD_GROUP', group._id);
      });
    }
  }, [groups, socket]);

  useEffect(() => {
    if (socket?.current) {
      console.log('KDAS', currentChat?._id);
    }
  }, [currentChat]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const { handleSubmit, register } = useForm<FormValues>();
  const { handleSubmit: handleSubmitFriend, register: registerFriend } = useForm<AddFriendFormValues>();

  const onSubmit = async (data: FormValues) => {
    // build message obj
    try {
      const response = await createGroup([...groupMembers, session?.user?._id], data.groupName, false);
      socket?.current.emit('ADD_GROUP', response.data.group._id);
      toast.success('Grupo criado com sucesso');
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmitFriend = async (data: AddFriendFormValues) => {
    // build message obj
    try {
      console.log(data);
      const response = await createGroup(
        [data.userId, session?.user?._id],
        data.userId + '-' + session?.user?._id,
        true
      );
      socket?.current.emit('ADD_GROUP', response.data.group._id);
      toast.success('Amigo adicionado com sucesso');
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickUser = (user: MongoUser) => {
    if (isCreatingGroup) {
      groupMembers.push(user._id);
      setGroupMembers([...groupMembers]);
      return;
    }
    setCurrentChat(user);
  };

  console.log(groups);
  return (
    <Flex width="100%" flexDirection="column" overflowY="scroll">
      <Flex
        borderBottomWidth="1px"
        padding={4}
        alignItems="center"
        gap="1rem"
        cursor="pointer"
        bg="gray.100"
        justifyContent="space-between"
      >
        <Avatar name="following user" src={session?.user?.avatar_url} />
        <Menu>
          <MenuButton>
            <BsThreeDotsVertical />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setIsCreatingGroup(true)}>Novo grupo</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column" padding="10" gap="1rem">
          <Input {...register('groupName')} placeholder="Nome do grupo" _placeholder={{ color: 'inherit' }} />
          <Button type="submit">Criar</Button>
        </Flex>
      </form>
      {/* {users?.length
        ? users.map((user, index) => (
            <Flex
              key={index}
              borderBottomWidth="1px"
              padding={4}
              alignItems="center"
              gap="1rem"
              cursor="pointer"
              _hover={{ backgroundColor: 'gray.100' }}
              onClick={() => handleClickUser(user)}
              backgroundColor={isCreatingGroup && groupMembers.includes(user._id) ? 'gray.100' : 'white'}
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
        : null} */}
      {groups?.length
        ? groups.map((group, index) => {
            console.log(group);
            const user = group.users.find((user) => user._id !== session?.user?._id);
            return (
              <Flex
                key={index}
                borderBottomWidth="1px"
                padding={4}
                alignItems="center"
                gap="1rem"
                cursor="pointer"
                _hover={{ backgroundColor: 'gray.100' }}
                backgroundColor={isCreatingGroup && groupMembers.includes(group._id) ? 'gray.100' : 'white'}
                onClick={() => {
                  if (group.is_private) {
                    group.avatar_url = user?.avatar_url;
                    group.name = user?.username as string;
                  }
                  handleClickUser(group);

                  setCurrentChat(group);
                }}
              >
                <Avatar name="Group" src={user?.avatar_url} />
                <Flex flexDirection="column">
                  <Text fontWeight="semibold">{user?.username}</Text>
                  <Text fontSize="small" fontWeight="light">
                    Ultima mensagem
                  </Text>
                </Flex>
              </Flex>
            );
          })
        : null}
      <form onSubmit={handleSubmitFriend(onSubmitFriend)}>
        <Flex flexDirection="column" padding="10" gap="1rem">
          <Select placeholder="Adicionar amigo" {...registerFriend('userId')}>
            {/* <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option> */}
            {users?.map((user, index) => (
              <option value={user?._id} key={index}>
                {user?.username}
              </option>
            ))}
          </Select>
          <Button type="submit">Adicionar</Button>
        </Flex>
      </form>
    </Flex>
  );
};
