import { NextAuthOptions,DefaultSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {prisma} from "./db"
import Googleprovi
declare module 'next-auth'{
    interface Session extends DefaultSession{
        user:{
            id:string,

        } & DefaultSession['user']
    }
}

export const authOptions:NextAuthOptions = {
    session:{
        strategy:'jwt'
    },
    callbacks:{
        jwt:async ({token}) =>{

            const db_user = await prisma.user.findFirst({
                where:{
                    email:token?.email
                }
            })
            if(db_user){
                token.id == db_user.id
            }
            return token
        },
        session:([session,token]) =>{
            if(token){
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture
            }
            return session
        }
    },
    secret:process.env.NEXTAUTH_SECRET,
    adapter:PrismaAdapter(prisma),
    providers:{
    
    }
    
}