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
`

export default transactionTypeDef;