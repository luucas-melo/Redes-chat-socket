import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const errorResponseHandler = (error: {
  response: { data: string | string[] | undefined };
  request: unknown;
  toJSON: () => unknown;
}) => {
  if (error?.response) {
    if (typeof error?.response?.data === 'string') {
      return Promise.reject(new Error(error.response.data));
    }

    return Promise.reject(new Error('Something went wrong'));
  }

  if (error?.request) {
    console.error('INTERNAL SERVER ERROR: ', error?.toJSON?.());

    return Promise.reject(new Error('Internal server error'));
  }

  return Promise.reject(error);
};

api.defaults.withCredentials = true;
api.interceptors.response.use((response) => response, errorResponseHandler);

export { api };
