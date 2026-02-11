export default interface Post {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly link: string;
    readonly sourceId: number;
    readonly date: string;
    readonly imageFileNames: string;
    readonly test: boolean;
}