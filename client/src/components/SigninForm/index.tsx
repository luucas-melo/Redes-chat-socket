import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { AiFillGithub } from 'react-icons/ai';
import { useState } from 'react';

export const SignInForm = () => {
  const { handleSubmit, register } = useForm();
  const [isInvalid, setIsInvalid] = useState(false);
  const onSubmit = async (credentials) => {
    // build message obj
    try {
      const response = await signIn('credentials', {
        ...credentials,
        redirect: true,
        callbackUrl: '/chat',
      });

      if (response?.ok) {
        toast.success('Seja bem vindo');
      } else {
        setIsInvalid(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Flex bg="gray.300" width="100%" height="100vh" alignItems="center" justifyContent="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column" background="white" borderRadius="10px" gap={4} padding={10} boxShadow="base">
          <FormControl maxW="600px" isInvalid={isInvalid} margin="0 auto">
            <FormLabel htmlFor="email">Usuário do github</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <AiFillGithub size={30} />
              </InputLeftElement>
              <Input {...register('username')} type="text" placeholder="Usuário git" isInvalid={isInvalid} />
            </InputGroup>
            {!isInvalid ? (
              <FormHelperText>Digite um usuário válido do github</FormHelperText>
            ) : (
              <FormErrorMessage>Usuário inválido</FormErrorMessage>
            )}
          </FormControl>
          <Button bg="whatsapp.300" color="white" _hover={{ bg: 'whatsapp.200' }} type="submit">
            Entrar
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
