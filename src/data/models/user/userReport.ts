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