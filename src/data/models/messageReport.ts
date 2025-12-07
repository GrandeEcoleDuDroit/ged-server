export type MessageReport = {
    readonly conversationId: string;
    readonly messageId: string;
    readonly recipient: Recipient;
    readonly reason: string;
}

type Recipient = {
    readonly fullName: string,
    readonly email: string
}