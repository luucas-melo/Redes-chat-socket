import { Grid } from '@chakra-ui/react';
import type { GetServerSidePropsContext } from 'next';
import { Sidebar } from '../components/Sidebar';
import { Chat as ChatComponent } from '../components/Chat';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { githubApi } from '../services/githubApi';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession(context);
    const response = await githubApi.get<IUser[]>(`/users/${session.user.username}/following`);

    return {
      props: { session: session, following: response.data },
    };
  } catch (error) {
    console.log(error);

    return {
      props: { session: null },
    };
  }
}

interface ChatProps {
  session: Session;
  following: MongoUser[];
}
const Chat = ({ session, following }: ChatProps) => {
  return (
    <Grid templateColumns="400px 1fr" height="100vh">
      <Sidebar session={session} following={following} />
      <ChatComponent session={session} />
    </Grid>
  );
};

export default Chat;
