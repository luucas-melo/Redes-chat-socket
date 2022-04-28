import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const nextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: {
            label: 'Username',
            type: 'text',
            placeholder: 'username',
          },
        },
        async authorize(credentials) {
          try {
            // Any object returned will be saved in `user` property of the JWT4

            const response = await axios.get(`https://api.github.com/users/${credentials?.username}`);
            console.log(response.data);
            return response.data;

            // If you return null or false then the credentials will be rejected
            // return null
            // You can also Reject this callback with an Error or with a URL:
            // throw new Error("error message") // Redirect to error page
            // throw "/path/to/redirect"        // Redirect to a URL
          } catch (error) {
            console.error('AUTHORIZE ERROR: ', error);

            return null;
          }
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/',
      signUp: '/',
      signOut: '/',
      error: '/',
    },
    callbacks: {
      async signIn({ user }: { user: IUser }) {
        if (user) return true;

        return false;
      },
      redirect({ url, baseUrl }) {
        if (url.startsWith(baseUrl)) return url;
        // Allows relative callback URLs
        if (url.startsWith('/')) return new URL(url, baseUrl).toString();

        return baseUrl;
      },
      jwt: async ({ token, user }) => {
        if (token?.user) {
          return token;
        }

        if (user) {
          token.user = user;
        }

        return token;
      },
      session: async ({ session, token }) => {
        session.user = token.user;
        session.token = token;

        return session;
      },
    },
  };

  // @ts-ignore
  return await NextAuth(req, res, nextAuthOptions);
}
