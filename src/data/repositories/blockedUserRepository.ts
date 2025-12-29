import OracleApi from '@api/oracleApi';
import * as getBlockedUserIdsQuery from '@queries/blockedUser/getBlockedUserIdsQuery';
import * as addBlockedUserQuery from '@queries/blockedUser/addBlockedUserQuery';
import * as removeBlockedUserQuery from '@queries/blockedUser/removeBlockedUserQuery';

const oracleApi = OracleApi.instance;

export default class BlockedUserRepository {
    async getBlockedUserIds(userId: string) {
        const query = getBlockedUserIdsQuery.query;
        const binds = getBlockedUserIdsQuery.binds(userId);
        const result = await oracleApi.execute(query, binds);
        return result.rows?.map(row  => (row as string[])[0]) ?? [];
    }

    async addBlockedUser(userId: string, blockedUserId: string) {
        const query = addBlockedUserQuery.query
        const binds = addBlockedUserQuery.binds(userId, blockedUserId)
        await oracleApi.execute(query, binds, { autoCommit: true })
    }

    async removeBlockedUser(userId: string, blockedUserId: string) {
        const query = removeBlockedUserQuery.query
        const binds = removeBlockedUserQuery.binds(userId, blockedUserId)
        await oracleApi.execute(query, binds, { autoCommit: true })
    }
}