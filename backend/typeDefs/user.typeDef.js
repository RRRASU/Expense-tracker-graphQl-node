const userTypeDef = `#graphql
    type User { 
        _id: ID!
        username: String!
        password: String!
        profilePicture: String
        name: String!
        gender: String!
        email: String
    }

    type Query {
        authUser: User
        users: [User]!
        user(userId: ID!): User
    }

    type Mutation {
        signUp(input: SignUpInput!) : User
        login(input: LoginInput!): User
        logout: LogoutResponse
    }

    input SignUpInput { 
        username: String!
        password: String!
        gender: String!
        name: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type LogoutResponse { 
        message: String!
        success: Boolean
    }
`;

export default userTypeDef;