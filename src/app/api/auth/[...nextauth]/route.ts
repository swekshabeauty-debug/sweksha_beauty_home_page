import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const dynamic = 'force-dynamic';


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Admin Password",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (credentials?.password === "Sri Raj 4321#@") {
                    return { id: "admin", name: "Admin", email: "admin@swekshabeauty.com" };
                }
                return null;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', // Redirect to login page if sign in is needed
    },
    callbacks: {
        async session({ session, token }) {
            return session;
        },
    },
});

export { handler as GET, handler as POST };
