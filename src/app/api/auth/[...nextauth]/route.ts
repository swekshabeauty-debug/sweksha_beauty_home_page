import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', // Redirect to login page if sign in is needed
    },
    callbacks: {
        async signIn({ user }) {
            const allowedEmails = ['swekshabeauty@gmail.com', 'jayant.kgp81@gmail.com'];
            if (user.email && allowedEmails.includes(user.email)) {
                return true;
            }
            return false; // Return false to deny access or a string URL to redirect to an error page
        },
        async session({ session, token }) {
            return session;
        },
    },
});

export { handler as GET, handler as POST };
