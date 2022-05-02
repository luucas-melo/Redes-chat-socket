import { AxiosResponse } from 'axios';
import { api } from './api';
import { IMessage } from './usersServices';

export interface IGroup {
  _id: string;
  users: MongoUser[];
  messages: IMessage[];
  name: string;
  isPrivate?: boolean;
  is_private?: boolean;
  avatar_url?: string;
}
interface CreateGroupResponse {
  group: IGroup;
}
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

export const getGroups = async (userId: string): Promise<AxiosResponse<CreateGroupResponse, any>> => {
  try {
    const response = await api.get('/groups/getGroups', { params: { id: userId } });

    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
};
