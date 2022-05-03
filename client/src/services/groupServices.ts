import { AxiosResponse } from 'axios';
import { api } from './api';

export interface IGroup {
  _id: string;
  users: MongoUser[];
  messages: { sender: string; message: { text: string } }[];
  name: string;
  isPrivate?: boolean;
  is_private?: boolean;
  avatar_url?: string;
}
interface CreateGroupResponse {
  group: IGroup;
}
// cria um grupo com os membros passados
export const createGroup = async (
  groupMembers: string[],
  name: string,
  isPrivate: boolean
): Promise<AxiosResponse<CreateGroupResponse, any>> => {
  try {
    const response = await api.post('/groups/createGroup', { users: groupMembers, name: name, isPrivate });

    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
};

// pega todos os grupos que o usuário logado participa
export const getGroups = async (userId: string): Promise<AxiosResponse<CreateGroupResponse, any>> => {
  try {
    const response = await api.get('/groups/getGroups', { params: { id: userId } });

    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
};
