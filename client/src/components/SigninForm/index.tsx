import { Button, Flex, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';

export const SignInForm = () => {
  const { handleSubmit, register } = useForm();
  const onSubmit = async (credentials) => {
    // build message obj
    try {
      const response = await signIn('credentials', {
        ...credentials,
        redirect: true,
        callbackUrl: '/chat',
      });

      if (response.ok) {
        toast.success('Seja bem vindo');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Flex background="#dcf8c6" width="100%" height="100vh" alignItems="center" justifyContent="center">
      <Flex flexDirection="column" background="white" borderRadius="10px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column" boxShadow="base" width="400px" padding="10" gap="1rem">
            <Input {...register('username')} placeholder="Username" _placeholder={{ color: 'inherit' }} />
            <Button type="submit">Entrar</Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
};
