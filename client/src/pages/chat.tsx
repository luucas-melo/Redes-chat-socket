import { Grid } from '@chakra-ui/react';
import type { GetServerSidePropsContext } from 'next';
import { Sidebar } from '../components/Sidebar';
import { Chat as ChatComponent } from '../components/Chat';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { getUsers } from '../services/usersServices';
import { IGroup, getGroups } from '../services/groupServices';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession(context);

    if (!session)
      return {
        props: { session: null },
      };
    const response = await getUsers(session?.user?._id);

    const groupsResponse = await getGroups(session?.user?._id);
    const groups = groupsResponse.data;
    return {
      props: { session: session, users: response.data, groups: groups },
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
  groups: IGroup[];
}
const Chat = ({ session, users, groups }: ChatProps) => {
  return (
    <Grid templateColumns="400px 1fr" height="100vh">
      <Sidebar session={session} users={users} groups={groups} />
      <ChatComponent session={session} />
    </Grid>
  );
};

export default Chat;
