import type {Reporter} from "@models/reporter";

export interface Announcement {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly date: string;
    readonly test: boolean;
    readonly userId: string;
}

export interface RemoteAnnouncement {
    readonly ANNOUNCEMENT_ID: string;
    readonly ANNOUNCEMENT_TITLE: string;
    readonly ANNOUNCEMENT_CONTENT: string;
    readonly ANNOUNCEMENT_DATE: number;
    readonly ANNOUNCEMENT_TEST: number;
    readonly USER_ID: string;
    readonly USER_FIRST_NAME: string;
    readonly USER_LAST_NAME: string;
    readonly USER_EMAIL: string;
    readonly USER_SCHOOL_LEVEL: number;
    readonly USER_ADMIN: number;
    readonly USER_PROFILE_PICTURE_FILE_NAME: string;
    readonly USER_STATE: number;
    readonly USER_TESTER: number;
}

export interface AnnouncementReport {
    readonly announcementId: string;
    readonly author: Author;
    readonly reporter: Reporter;
    readonly reason: string;
}

interface Author {
    readonly fullName: string,
    readonly email: string
}