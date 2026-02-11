
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Admin Password",
            credentials: {
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (credentials?.password === "Sri Raj 4321#@") {
                    return { id: "admin", name: "Admin", email: "admin@swekshabeauty.com" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            return session;
        },
    },
})
