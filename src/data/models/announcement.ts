export type Announcement = {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly date: string;
    readonly userId: string;
}

export type AnnouncementReport = {
    readonly announcementId: string;
    readonly author: Author;
    readonly reporter: Reporter;
    readonly reason: string;
}

type Author = {
    readonly fullName: string,
    readonly email: string
}

type Reporter = {
    readonly fullName: string,
    readonly email: string
}