import { AxiosResponse } from 'axios';
import { api } from './api';

export const addNewMessage = async (message: IChat) => {
  try {
    const response = await api.post<IChat['message']>('/messages/addNewMessage', message);

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getMessages = async (from: string, to: string, isPrivate = true): Promise<AxiosResponse<IChat[], any>> => {
  try {
    const response = await api.get<IChat[]>('/messages/getMessages', {
      params: { from, to, isPrivate },
    });

    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
};

export const getGroupsMessages = async (id: string, userId: string): Promise<AxiosResponse<IChat[], any>> => {
  try {
    const response = await api.get<IChat[]>('/messages/getMessages', {
      params: { id, userId },
    });

    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
};
