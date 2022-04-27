import { Grid } from '@chakra-ui/react';
import type { GetServerSidePropsContext } from 'next';
import { Sidebar } from '../components/Sidebar';
import { Chat as ChatComponent } from '../components/Chat';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession(context);

    return {
      props: { session: session },
    };
  } catch (error) {
    console.log(error);

    return {
      props: { session: null },
    };
  }
}

const Chat = ({ session }: { session: Session }) => {
  return (
    <Grid templateColumns="400px 1fr" height="100vh">
      <Sidebar session={session} />
      <ChatComponent session={session} />
    </Grid>
  );
};

export default Chat;
