const OracleDatabaseManager = require("./oracleDatabaseManager");
const User = require("./model/user");

class UserRepository {
    #oracleDatabaseManager = new OracleDatabaseManager();
    #oracleConnection;

    constructor() {
        this.#oracleDatabaseManager = this.#oracleDatabaseManager.getConnection();
    }

    async createUser(response, user) {
        try {
            if (!this.#oracleConnection) {
                return response.status(500).json({ error: 'Database connection not established' });
            }
            const query = `
                INSERT INTO USERS(
                    USER_FIRST_NAME,
                    USER_LAST_NAME,
                    USER_MAIL,
                    USER_SCHOOL_LEVEL,
                    USER_IS_MEMBER
                )
                VALUES(
                    :user_first_name,
                    :user_last_name,
                    :user_email,
                    :user_school_level
                )
            `;

            this.#oracleConnection.execute(
                query,
                [
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.schoolLevel,
                ],
                {autoCommit: true }
            );

            console.log(`User ${user.firstName} ${user.lastName} create successfully`);
            response.status(201).json('User created successfully.');
        }
        catch (error) {
            console.error('Error inserting user:', error);
            response.status(500).send('Error inserting user');
        }
    }
}

module.exports = UserRepository;