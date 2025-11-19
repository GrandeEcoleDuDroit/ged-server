export type MessageReport = {
    readonly conversationId: string;
    readonly messageId: string;
    readonly recipientInfo: UserInfo;
    readonly reason: string;
}

type UserInfo = {
    readonly fullName: string,
    readonly email: string
}