import OracleApi from '@api/oracleApi';
import * as getBlockedUserIdsQuery from '@queries/blockedUser/getBlockedUserIdsQuery';
import * as getAllBlockedUserIdsQuery from '@queries/blockedUser/getAllBlockedUserIdsQuery';
import * as addBlockedUserQuery from '@queries/blockedUser/addBlockedUserQuery';
import * as removeBlockedUserQuery from '@queries/blockedUser/removeBlockedUserQuery';
import type BlockedUser from "@models/user/blockedUser";

const oracleApi = OracleApi.instance;

export default class BlockedUserRepository {
    private static _instance: BlockedUserRepository;
    static get instance() {
        return this._instance || (this._instance = new this());
    }

    private _blockedUsers = new Map<string, BlockedUser[]>();
    get blockedUsers(): Map<string, BlockedUser[]> {
        return this._blockedUsers;
    }

    private constructor() {
        this.getAllBlockedUsers()
            .then(blockedUsersList =>
                blockedUsersList.map(blockedUsers =>
                    this.blockedUsers.set(blockedUsers.USER_ID, blockedUsers.BLOCKED_USERS)
                )
            )
            .catch(error => console.error(error))
    }

    private async getAllBlockedUsers(): Promise<BlockedUsers[]> {
        const result = await oracleApi.execute(getAllBlockedUserIdsQuery.query);
        return result.rows?.map(row =>
            JSON.parse(row as [string][0]) as BlockedUsers
        ) ?? [];
    }

    async getBlockedUsers(userId: string): Promise<BlockedUser[]> {
        const result = await oracleApi.execute(
            getBlockedUserIdsQuery.query,
            getBlockedUserIdsQuery.binds(userId)
        );
        return result.rows?.map(row  =>
            JSON.parse(row as [string][0]) as BlockedUser
        ) ?? [];
    }

    async addBlockedUser(blockedUser: BlockedUser): Promise<void> {
        await oracleApi.execute(
            addBlockedUserQuery.query,
            addBlockedUserQuery.binds(blockedUser),
            { autoCommit: true }
        )

        const blockedUsers = this._blockedUsers.get(blockedUser.USER_ID) ?? []
        blockedUsers?.push(blockedUser);
        this._blockedUsers.set(blockedUser.USER_ID, blockedUsers);
    }

    async removeBlockedUser(userId: string, blockedUserId: string): Promise<void> {
        const query = removeBlockedUserQuery.query
        const binds = removeBlockedUserQuery.binds(userId, blockedUserId)
        await oracleApi.execute(query, binds, { autoCommit: true })

        const blockedUsers = this._blockedUsers.get(userId)
            ?.filter(b => b.BLOCKED_USER_ID !== blockedUserId);
        if (blockedUsers) {
            this._blockedUsers.set(userId, blockedUsers);
        }
    }
}

interface BlockedUsers {
    USER_ID: string;
    BLOCKED_USERS: BlockedUser[];
}