import { AxiosResponse } from 'axios';
import { api } from './api';

export interface IMessage {
  from: string;
  to: string;
  message: string;
}

export const getUsers = async (currentUserId: string): Promise<AxiosResponse<MongoUser[], any>> => {
  try {
    const response = await api.get<MongoUser[]>('/users/getUsers', { params: { id: currentUserId } });
    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
};
