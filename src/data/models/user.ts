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
    readonly reportedUser: ReportedUser;
    readonly reporter: Reporter;
    readonly reason: string;
}

type ReportedUser = {
    readonly id: string;
    readonly fullName: string,
    readonly email: string
}

type Reporter = {
    readonly fullName: string,
    readonly email: string
}