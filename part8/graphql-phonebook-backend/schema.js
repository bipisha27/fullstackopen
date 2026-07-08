const typeDefs = `#graphql
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address
    friendOf: [User!]!
    id: ID!
  }

  type User{
    username: String!
    friends: [String!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Subscription {
    personAdded: Person!
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(name: String!, phone: String!): Person

    createUser(username: String!) : User

    login(username: String!, password: String!): Token

    addAsFriend(name: String): User
    
    _resetDatabase: Boolean
  }
`;

module.exports = typeDefs;
