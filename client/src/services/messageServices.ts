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

export const getCurrentChatMessages = async (from: string, to: string): Promise<AxiosResponse<IChat[], any>> => {
  try {
    const response = await api.get<IChat[]>('/messages/getPrivateMessages', {
      params: { from, to },
    });

    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
};
