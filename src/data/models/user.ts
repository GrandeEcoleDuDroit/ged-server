export class User {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly schoolLevel: string;
    readonly isMember: number;
    readonly profilePictureFileName: string;

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        schoolLevel: string,
        isMember: number = 0,
        profilePictureFileName: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.schoolLevel = schoolLevel;
        this.isMember = isMember;
        this.profilePictureFileName = profilePictureFileName;
    }
}