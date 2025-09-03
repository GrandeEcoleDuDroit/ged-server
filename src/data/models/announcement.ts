export class Announcement {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly date: number;
    readonly userId: string;

    constructor(
        id: string,
        title: string,
        content: string,
        date: number,
        userId: string
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.date = date;
        this.userId = userId;
    }
}