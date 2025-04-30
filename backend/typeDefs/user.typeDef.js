const userTypeDef = `#graphql
    type User { 
        _id: ID!
        userName: String!
        password: String!
        profilePicture: String
        name: String!
        gender: String!
        email: String
    }

    type Query {
        users: [User]!
        authUser: User
        user(userId: ID!): User
    }
`;
