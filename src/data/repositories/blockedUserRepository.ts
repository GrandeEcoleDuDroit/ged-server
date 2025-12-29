import OracleApi from '@api/oracleApi';
import type { User } from '@models/user';
import * as getBlockedUsersQuery from '@queries/blockedUser/getBlockedUsersQuery';
import * as addBlockedUserQuery from '@queries/blockedUser/addBlockedUserQuery';
import * as removeBlockedUserQuery from '@queries/blockedUser/removeBlockedUserQuery';

const oracleApi = OracleApi.instance;

export default class BlockedUserRepository {
    async getBlockedUsers(userId: string) {
        const query = getBlockedUsersQuery.query;
        const binds = getBlockedUsersQuery.binds(userId);
        const result = await oracleApi.execute(query, binds);
        return result.rows?.map(row =>
            JSON.parse(row as [string][0]) as User
        ) ?? [];
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