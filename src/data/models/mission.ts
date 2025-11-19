export type Mission = {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly schoolLevels: string;
    readonly date: number;
    readonly startDate: number;
    readonly endDate: number;
    readonly duration: string | null;
    readonly maxParticipants: number;
    readonly imageFileName: string | null;
}

export type MissionTask = {
    readonly id: string;
    readonly value: string;
}

export type MissionReport = {
    readonly missionId: string;
    readonly userInfo: UserInfo;
    readonly reason: string;
}

type UserInfo = {
    readonly fullName: string,
    readonly email: string
}