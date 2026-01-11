import FirebaseApi from '@api/firebaseApi';
import OracleApi from "@api/oracleApi";
import type {FcmMessage, FcmMulticastMessage} from '@models/fcmMessage';
import type {FcmToken} from "@models/fcmToken";
import * as getFcmTokensQuery from "@queries/fcmTokenQueries/getFcmTokensQuery"
import * as addFcmTokenQuery from "@queries/fcmTokenQueries/addFcmTokenQuery"
import * as deleteFcmTokenQuery from "@queries/fcmTokenQueries/deleteFcmTokenQuery";
import type {User} from "@models/user/user";

const firebaseApi = new FirebaseApi();
const oracleApi = OracleApi.instance;

export default class FcmRepository {
    private static _instance: FcmRepository;
    static get instance(): FcmRepository {
        return this._instance || (this._instance = new this());
    }

    private _fcmTokens = new Map<string, string[]>();
    get fcmTokens(): Map<string, string[]> {
        return this._fcmTokens;
    }

    private constructor() {
        this.getAllFcmToken()
            .then(fcmTokens => fcmTokens.map(fcmToken => this._fcmTokens.set(fcmToken.USER_ID, fcmToken.TOKENS)))
            .catch(error => console.error(error))
    }

    private async getAllFcmToken(): Promise<FcmToken[]> {
        const result = await oracleApi.execute(getFcmTokensQuery.query);
        return result.rows?.map(row =>
            JSON.parse(row as [string][0]) as FcmToken
        ) ?? [];
    }

    async addToken(userId: string, token: string)  {
        await oracleApi.execute(
            addFcmTokenQuery.query,
            addFcmTokenQuery.binds(userId, token),
            { autoCommit: true }
        );

        const tokens = this._fcmTokens.get(userId) ?? []
        tokens?.push(token)
        this._fcmTokens.set(userId, tokens);
    }

    async deleteToken(userId: string, token: string) {
        await oracleApi.execute(
            deleteFcmTokenQuery.query,
            deleteFcmTokenQuery.binds(userId, token),
            { autoCommit: true }
        )

        const tokens = this._fcmTokens.get(userId)?.filter(s => s !== token);
        if (tokens) {
            this._fcmTokens.set(userId, tokens);
        }
    }

    async sendNotification(fcmMessage: FcmMessage) {
        await firebaseApi.sendNotification(fcmMessage);
    }

    async sendNotifications(fcmMulticastMessage: FcmMulticastMessage) {
        await firebaseApi.sendMulticastNotification(fcmMulticastMessage);
    }
}