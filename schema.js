
const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Dealership {
    id: String!
    name: String!
    description: String!
  }

  type Car {
    id: String!
    name: String!
    description: String!
  }

  type Query {
    dealership(id: String!): Dealership
    dealerships: [Dealership]
    car(id: String!): Car
    cars: [Car]
  }

  type Mutation {
    createDealership(id: String!, name: String!, description: String!): Dealership
  }
`;

module.exports = typeDefs;
