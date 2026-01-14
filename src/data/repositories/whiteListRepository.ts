import WhiteListFields from '@fields/whiteListField';
import OracleApi from '@api/oracleApi';
import type {Result} from 'oracledb';

const oracleApi = OracleApi.instance;

export default class WhiteListRepository {
    async isUserWhiteListed(userEmail: string) {
        const query = `
            SELECT COUNT(*) 
            FROM ${WhiteListFields.TABLE_NAME} 
            WHERE ${WhiteListFields.USER_EMAIL} = :user_email
        `;

        const binds = { user_email: userEmail };
        const result = await oracleApi.execute(query, binds) as Result<number[]>;
        const count = result.rows?.[0]?.[0];
        return count ? count > 0 : false;
    }
}