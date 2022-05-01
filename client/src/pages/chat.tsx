import { Grid } from '@chakra-ui/react';
import type { GetServerSidePropsContext } from 'next';
import { Sidebar } from '../components/Sidebar';
import { Chat as ChatComponent } from '../components/Chat';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { getUsers } from '../services/usersServices';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession(context);
    const response = await getUsers(session?.user?._id);

    return {
      props: { session: session, users: response.data },
    };
  } catch (error) {
    return {
      props: { session: null },
    };
  }
}

interface ChatProps {
  session: Session;
  users: MongoUser[];
}
const Chat = ({ session, users }: ChatProps) => {
  return (
    <Grid templateColumns="400px 1fr" height="100vh">
      <Sidebar session={session} users={users} />
      <ChatComponent session={session} />
    </Grid>
  );
};

export default Chat;
