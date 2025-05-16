const transactionTypeDef = `#graphql 
    type Transaction { 
        id: ID!
        amount: Float!
        userId: ID!
        description: String!
        paymentType: String! 
        category: String!
        locations: String!
        date: String!
    }

    type Query {
        transactions: [Transaction!]!
        transaction(id: ID!): Transaction
    }

    type Mutation {
        createTransaction(input: CreateTransactionInput!): Transaction!,
        updateTransaction(input: UpdateTransactionInput!): Transaction!,
        deleteTransaction(input: DeleteTransactionInput!): Transaction!
    }

    # fragment TrasactionInput on Transaction {
    #     id: ID!
    #     amount: Float!
    #     userId: ID!
    #     description: String!
    #     paymentType: String! 
    #     category: String!
    #     locations: String!
    #     date: String!
    # }

    input CreateTransactionInput { 
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        date: String!
        location: String    
    }

    input UpdateTransactionInput {
            transactionId: ID!
        description: String
        paymentType: String
        category: String
        amount: Float
        location: String
        date: String
    }

    input DeleteTransactionInput {
        transactionId: ID!,
    }
`;

export default transactionTypeDef;
