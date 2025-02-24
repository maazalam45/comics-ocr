import { NextAuthOptions } from "next-auth";
import {
  getUser,
  googleAuth,
  login,
  loginWithToken,
  refreshToken,
} from "@/services/auth";
import CredentialProvider from "next-auth/providers/credentials";
import { PUBLIC_API_URL } from "../../../../../config";
interface Token {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  error?: any;
}

let userDetails: any = null;
async function refreshAccessToken(token: Token): Promise<Token> {
  try {
    const refreshedTokens = await refreshToken(token.refreshToken);
    return {
      ...token,
      accessToken: refreshedTokens.token,
      accessTokenExpires: Date.now() + 10 * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
export const authOptions: NextAuthOptions = {
  secret: "INp6HjGDyOpYnGAEdLoQSDDPKAlwLEdnDcCkFvA8QSPR",
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "johndoe@test.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          console.log(credentials, "CREDS");
          // const userToken = credentials.token;
          // if (userToken) {
          //   const response = await loginWithToken({ token: userToken });
          //   return Promise.resolve(response ? { ...response } : {}) as any;
          // } else {
          const response = await login({
            email: credentials.email,
            password: credentials.password,
          });
          const myHeaders = new Headers();
          myHeaders.append("accept", "application/json");
          myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
          const urlencoded = new URLSearchParams();
          urlencoded.append("email", credentials?.email);
          urlencoded.append("password", credentials?.password);

          const requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow",
          };

          fetch(`${PUBLIC_API_URL}/user/signin/`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
              console.log(result);
            })
            .catch((error) => console.log(error));
          return Promise.resolve(response ? { ...response } : {}) as any;
          // }
        } catch (e: any) {
          return Promise.reject(e);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    async signIn({ user }: any) {
      if (user?.token) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    },
    async session({ session, token }: any) {
      if (!token.accessToken) {
        return Promise.resolve(session);
      }
      if (token.accessToken && token.user) {
        session.accessToken = token.accessToken;
        session.user = token.user as any;
      }
      if (userDetails) {
        session.accessToken = userDetails.token;
        session.user = userDetails;
      }
      const getuserdetails = await getUser(token.accessToken as string);
      session.user = { ...session.user, ...getuserdetails };
      if (getuserdetails) return Promise.resolve(session);
      else return Promise.reject("User not found");
    },
    async jwt({ token, user }: any) {
      if (user?.token) {
        // eslint-disable-next-line
        token = {
          accessToken: user.token,
          accessTokenExpires: Date.now() + 10 * 1000,
          refreshToken: user.refreshToken,
          user: user,
        };
      }
      if (Date.now() >= token?.user.tokenExpires)
        return Promise.reject("User not found");
      if (token.token && !token.user) {
        const userdetails = await getUser(token.accessToken as string);
        if (userdetails) token.user = userdetails;
        else return Promise.reject("User not found");
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
  },
};
