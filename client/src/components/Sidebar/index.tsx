import { Avatar, Button, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Select, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useChat } from '../../context/ChatContext';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createGroup, IGroup } from '../../services/groupServices';
import { toast } from 'react-toastify';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useRequest } from '../../hooks/useRequest';
interface SidebarProps {
  session: Session;
  users: MongoUser[];
  groups: IGroup[];
}
export const Sidebar = ({ session }: SidebarProps) => {
  const { setCurrentChat, socket } = useChat();
  const [groupMembers, setGroupMembers] = useState<MongoUser['_id'][]>([]);

  interface FormValues {
    groupName: string;
  }

  interface AddFriendFormValues {
    userId: string;
  }

  const { data: users, mutate: mutateFriend } = useRequest<IGroup[], string>({
    method: 'GET',
    url: '/users/getUsers',
    params: { id: session?.user?._id },
  });
  const { data: groups, mutate } = useRequest<IGroup[], string>({
    method: 'GET',
    url: '/groups/getGroups',
    params: { id: session?.user?._id },
  });

  useEffect(() => {
    if (socket?.current) {
      // loop para adicionar ao socket todos os grupos que o usuário está
      groups?.forEach((group) => {
        socket?.current.emit('ADD_GROUP', group._id);
      });
    }
  }, [groups, socket]);

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const { handleSubmit, register } = useForm<FormValues>();
  const { handleSubmit: handleSubmitFriend, register: registerFriend } = useForm<AddFriendFormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      // cria o grupo
      const response = await createGroup([...groupMembers, session?.user?._id], data.groupName, false);
      // adiciona o grupo ao socket
      socket?.current.emit('ADD_GROUP', response.data.group._id);
      toast.success('Grupo criado com sucesso');
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingGroup(false);
    }
  };
  const onSubmitFriend = async (data: AddFriendFormValues) => {
    try {
      const response = await createGroup(
        [data.userId, session?.user?._id],
        data.userId + '-' + session?.user?._id,
        true
      );
      // adiciona o grupo entre 2 pessoas ao socket
      socket?.current.emit('ADD_GROUP', response.data.group._id);
      await mutate();
      await mutateFriend();
      toast.success('Amigo adicionado com sucesso');
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (user: MongoUser) => {
    if (groupMembers.includes(user._id)) {
      setGroupMembers(groupMembers.filter((member) => member !== user._id));
    } else {
      setGroupMembers([...groupMembers, user._id]);
    }
  };

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
        width="100%"
      >
        {/* <Button onClick={() => socket?.current.emit('LEAVE_GROUP', session?.user?._id, currentChat?._id)}>leva</Button> */}
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
      {isCreatingGroup ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column" padding="10" gap="1rem">
            <Input {...register('groupName')} placeholder="Nome do grupo" _placeholder={{ color: 'inherit' }} />
            <Button bg="whatsapp.300" color="white" _hover={{ bg: 'whatsapp.200' }} type="submit">
              Criar grupo
            </Button>
          </Flex>
        </form>
      ) : null}
      {isCreatingGroup && <Text fontWeight="medium">Selecionar membros:</Text>}
      {groups?.length
        ? groups.map((group, index) => {
            const user = group.users.find((user) => user._id !== session?.user?._id);
            return (
              <Flex
                key={index}
                borderBottomWidth="1px"
                padding={4}
                alignItems="center"
                justifyContent="space-between"
                cursor="pointer"
                _hover={{ backgroundColor: 'gray.100' }}
                backgroundColor={
                  isCreatingGroup && group.is_private && groupMembers.includes(user?._id as string)
                    ? 'gray.100'
                    : 'white'
                }
                onClick={() => {
                  if (group.is_private) {
                    group.avatar_url = user?.avatar_url;
                    group.name = user?.username as string;
                    if (isCreatingGroup) {
                      handleClick(user as MongoUser);
                    }
                  }
                  if (!isCreatingGroup) setCurrentChat(group);
                }}
              >
                <Flex gap="1rem">
                  <Avatar name="Group" src={group.is_private ? user?.avatar_url : ''} />
                  <Flex flexDirection="column">
                    <Text fontWeight="semibold">{group.is_private ? user?.username : group?.name}</Text>
                    <Text fontSize="small" fontWeight="light">
                      Ultima mensagem
                    </Text>
                  </Flex>
                </Flex>
                {isCreatingGroup && group.is_private && groupMembers.includes(user?._id as string) ? (
                  <Flex justifyContent="flex-end">
                    <AiOutlineCheckCircle fill="green" />
                  </Flex>
                ) : null}
              </Flex>
            );
          })
        : null}
      {!isCreatingGroup ? (
        <form onSubmit={handleSubmitFriend(onSubmitFriend)}>
          <Flex flexDirection="column" padding="10" gap="1rem">
            <Select placeholder="Adicionar amigo" {...registerFriend('userId')}>
              {users?.map((user, index) => (
                <option value={user?._id} key={index}>
                  {user?.username}
                </option>
              ))}
            </Select>
            <Button type="submit">Adicionar</Button>
          </Flex>
        </form>
      ) : null}
    </Flex>
  );
};
