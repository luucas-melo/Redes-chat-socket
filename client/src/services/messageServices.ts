import { api } from './api';

export interface IMessage {
  from: string;
  to: string;
  message: string;
}
export const addNewMessage = async (message: IMessage) => {
  try {
    const response = await api.post('/messages/add-new-nessage', message);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
