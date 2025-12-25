export interface Announcement {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly date: string;
    readonly test: boolean;
    readonly userId: string;
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

interface Reporter {
    readonly fullName: string,
    readonly email: string
}