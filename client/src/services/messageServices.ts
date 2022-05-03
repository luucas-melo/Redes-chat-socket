import { AxiosResponse } from 'axios';
import { api } from './api';
import { IGroup } from './groupServices';

export const addNewMessage = async (message: IChat): Promise<AxiosResponse<IGroup, any>> => {
  try {
    const response = await api.post<IGroup>('/messages/addNewMessage', message);

    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
};

export const getMessages = async (from: string, to: string, isPrivate = true): Promise<AxiosResponse<IGroup, any>> => {
  try {
    const response = await api.get<IGroup>('/messages/getMessages', {
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
