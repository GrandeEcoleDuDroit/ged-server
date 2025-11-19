export type User = {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly schoolLevel: number;
    readonly admin: number;
    readonly profilePictureFileName: string | null;
    readonly state: string;
    readonly tester: number;
}

export type UserReport = {
    readonly userId: string;
    readonly userInfo: UserInfo;
    readonly reporterInfo: UserInfo;
    readonly reason: string;
}

type UserInfo = {
    readonly fullName: string,
    readonly email: string
}