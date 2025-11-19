export type Announcement = {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly date: string;
    readonly userId: string;
}

export type AnnouncementReport = {
    readonly announcementId: string;
    readonly authorInfo: UserInfo;
    readonly userInfo: UserInfo;
    readonly reason: string;
}

type UserInfo = {
    readonly fullName: string,
    readonly email: string
}