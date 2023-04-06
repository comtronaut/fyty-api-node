import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class NotifyService {

    constructor(private readonly prisma: PrismaService) {}

    async sendNotification(message: string, token: string): Promise<void> {

        const url = 'https://notify-api.line.me/api/notify';
        const headers = {Authorization: `Bearer ${token}`,};

        try {
            //use lineNotify API 
            await axios.postForm(url, {message}, { headers });
            console.log('success')
        } catch (error) {
            console.error(error);
            console.log('error')
            throw new Error('Failed to send notification');
        }
    }

    async getLine(res: { redirect: (arg0: string) => void; }, userId: string): Promise<void> {

        const clientId = 'pyQHEFXVPWHQhVXee6dFEv';
        //callback url 
        const callbackUri = 'http://localhost:3000/callback';

        const queryParams = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: callbackUri,
            scope: 'notify',
            state: userId,
        });

        const authorizeUrl = `https://notify-bot.line.me/oauth/authorize?${queryParams.toString()}`;
        res.redirect(authorizeUrl);
    }

    async authenticate(code:string,clientId:string,clientSecret:string,redirectUri: string) {
        
        const headers = {'Content-Type': 'application/x-www-form-urlencoded',};
        //use lineNotify API
        const response = await axios.post('https://notify-bot.line.me/oauth/token', {
            grant_type: 'authorization_code',
            code:code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
        },{headers});

        return response.data;
    }

    async callback( code: string, state: string) {
        //callback url
        const redirectUri = 'http://localhost:3000/callback';
        const CLIENT_ID = 'pyQHEFXVPWHQhVXee6dFEv';
        const CLIENT_SECRET = 'BWH2rJcYWeTco1A7c76I7tlYfPmyeDs8htlEiyjQzrf';
        
        try {
            //get lineNotify token
            const token = await this.authenticate(code, CLIENT_ID, CLIENT_SECRET,redirectUri);

            //update line_token in user
            const res = await this.prisma.user.update({
                where: {
                    id:state
                },
                data: {
                    lineToken:token.access_token
                }
            });

            return res;  
        } catch (error) {
            console.error('Error occurred while authenticating:', error);
        }
    }
}