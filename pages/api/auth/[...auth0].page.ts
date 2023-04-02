// pages/api/auth/[...auth0].js
import { handleAuth, handleProfile, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth();
