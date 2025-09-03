export class User {
    constructor(id, firstName, lastName, email, schoolLevel, isMember = 0, profilePictureFileName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.schoolLevel = schoolLevel;
        this.isMember = isMember;
        this.profilePictureFileName = profilePictureFileName;
    }
}
