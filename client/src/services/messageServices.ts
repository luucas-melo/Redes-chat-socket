import { api } from './api';

export interface IMessage {
  from: string;
  to: string;
  message: string;
}
export const addNewMessage = async (message: IMessage) => {
  try {
    const response = await api.post<IMessage['message']>('/messages/add-new-message', message);

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
