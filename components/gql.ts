import { GraphQLClient, gql } from 'graphql-request';
import jwt from 'jsonwebtoken';

let client: any = null;
const getAccessToken = (user: any) => {
  if (!user) throw new Error('User undefined');
  const token = jwt.sign(
    { sub: user?.sub, exp: Math.floor(Date.now() / 1000) + 60, iat: Math.floor(Date.now() / 1000) },
    process.env.NEXT_PUBLIC_JWT_SECRET!,
  );
  return token;
};

const gqlInit = (user: any) => {
  const token = getAccessToken(user);
  client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URI!, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return client;
};

export default gqlInit;
