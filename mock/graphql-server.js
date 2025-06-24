const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const db = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json"), "utf8"));

// Schema
const typeDefs = gql`
  type JobDetail {
    id: ID!
    sku: String!
    status: String!
    assignedUser: String!
    createdDate: String!
    description: String!
  }

  type Query {
    job(id: ID!): JobDetail
  }
`;

const resolvers = {
  Query: {
    job: (_, { id }) => {
      const job = db.jobs.find((j) => j.id === id);
      return job
        ? {
            ...job,
            description: "This is a detailed description for " + job.id,
          }
        : null;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 GraphQL mock server ready at ${url}`);
});
