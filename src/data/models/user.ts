export interface User {
    readonly userId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly schoolLevel: number;
    readonly admin: number;
    readonly profilePictureFileName: string | null;
    readonly state: string;
    readonly tester: number;
}

export interface FirestoreUser {
    readonly userId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly schoolLevel: number;
    readonly admin: boolean;
    readonly profilePictureFileName: string | null;
    readonly state: string;
    readonly tester: boolean;
}

export interface UserReport {
    readonly reportedUser: ReportedUser;
    readonly reporter: Reporter;
    readonly reason: string;
}

interface ReportedUser {
    readonly id: string;
    readonly fullName: string,
    readonly email: string
}

interface Reporter {
    readonly fullName: string,
    readonly email: string
}