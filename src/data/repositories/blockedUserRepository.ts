import OracleApi from '@api/oracleApi';
import * as getBlockedUserIdsQuery from '@queries/blockedUser/getBlockedUserIdsQuery';
import * as getAllBlockedUserIdsQuery from '@queries/blockedUser/getAllBlockedUserIdsQuery';
import * as addBlockedUserQuery from '@queries/blockedUser/addBlockedUserQuery';
import * as removeBlockedUserQuery from '@queries/blockedUser/removeBlockedUserQuery';

const oracleApi = OracleApi.instance;

export default class BlockedUserRepository {
    private static _instance: BlockedUserRepository;
    static get instance() {
        return this._instance || (this._instance = new this());
    }

    private _blockedUserIds = new Map<string, string[]>();
    get blockedUserIds(): Map<string, string[]> {
        return this._blockedUserIds;
    }

    private constructor() {
        this.getAllBlockedUserIds()
            .then(blockedUserIdsList =>
                blockedUserIdsList.map(blockedUserIds => this._blockedUserIds.set(blockedUserIds.USER_ID, blockedUserIds.BLOCKED_USER_IDS))
            )
            .catch(error => console.error(error))
    }

    private async getAllBlockedUserIds(): Promise<BlockedUserIds[]> {
        const result = await oracleApi.execute(getAllBlockedUserIdsQuery.query);
        return result.rows?.map(row => (row as BlockedUserIds[])[0]) ?? [];
    }

    async getBlockedUserIds(userId: string): Promise<string[]> {
        const result = await oracleApi.execute(
            getBlockedUserIdsQuery.query,
            getBlockedUserIdsQuery.binds(userId)
        );
        return result.rows?.map(row  => (row as string[])[0]) ?? [];
    }

    async addBlockedUser(userId: string, blockedUserId: string): Promise<void> {
        await oracleApi.execute(
            addBlockedUserQuery.query,
            addBlockedUserQuery.binds(userId, blockedUserId),
            { autoCommit: true }
        )

        const blockedUserIds = this._blockedUserIds.get(userId) ?? []
        blockedUserIds?.push(blockedUserId)
        this._blockedUserIds.set(userId, blockedUserIds);
    }

    async removeBlockedUser(userId: string, blockedUserId: string): Promise<void> {
        const query = removeBlockedUserQuery.query
        const binds = removeBlockedUserQuery.binds(userId, blockedUserId)
        await oracleApi.execute(query, binds, { autoCommit: true })

        const blockedUserIds = this._blockedUserIds.get(userId)?.filter(s => s !== blockedUserId);
        if (blockedUserIds) {
            this._blockedUserIds.set(userId, blockedUserIds);
        }
    }
}

interface BlockedUserIds {
    USER_ID: string;
    BLOCKED_USER_IDS: string[];
}