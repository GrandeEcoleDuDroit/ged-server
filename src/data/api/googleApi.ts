import { createTransport, TransportOptions } from 'nodemailer';
import { google } from 'googleapis';
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN,
    EMAIL_ADDRESS
} from '@root/env'

const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

export async function sendMail(subject: string, html: string) {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: EMAIL_ADDRESS,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            refreshToken: GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken,
        },
    } as TransportOptions);

    const mailOptions = {
        from: `Ged Web Server <${EMAIL_ADDRESS}>`,
        to: EMAIL_ADDRESS,
        subject: subject,
        html: html,
    };

    return await transporter.sendMail(mailOptions);
}