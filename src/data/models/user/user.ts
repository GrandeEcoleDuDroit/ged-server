export interface User {
    readonly userId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly schoolLevel: number;
    readonly admin: number;
    readonly profilePictureFileName: string | null;
    readonly state: number;
    readonly tester: number;
}

export interface OracleUser {
    readonly USER_ID: string;
    readonly USER_FIRST_NAME: string;
    readonly USER_LAST_NAME: string;
    readonly USER_EMAIL: string;
    readonly USER_SCHOOL_LEVEL: number;
    readonly USER_ADMIN: number;
    readonly USER_PROFILE_PICTURE_FILE_NAME: string | null;
    readonly USER_STATE: number;
    readonly USER_TESTER: number;
}

export interface FirestoreUser {
    readonly userId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly schoolLevel: number;
    readonly admin: boolean;
    readonly profilePictureFileName: string | null;
    readonly state: number;
    readonly tester: boolean;
}