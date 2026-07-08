const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const Person = require("./models/person");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),

    allPersons: async (root, args) => {
      console.log("Person.find");

      if (!args.phone) {
        return Person.find({}).populate("friendOf");
      }

      return Person.find({ phone: { $exists: args.phone === "YES" } }).populate(
        "friendOf",
      );
    },

    findPerson: async (root, args) => Person.findOne({ name: args.name }),

    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Person: {
    address: ({ street, city }) => {
      return {
        street,
        city,
      };
    },

    friendOf: async (root) => {
      console.log("User.find");

      const friends = await User.find({
        friends: {
          $in: [root._id],
        },
      });
      return friends;
    },
  },

  Mutation: {
    addPerson: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const nameExists = await Person.exists({ name: args.name });

      if (nameExists) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      const person = new Person({ ...args });

      try {
        await person.save();
        currentUser.friends = currentUser.friends.concat(person);
        await currentUser.save();
      } catch (error) {
        throw new GraphQLError(`saving person failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      pubsub.publish("PERSON_ADDED", { personAdded: person });

      return person;
    },

    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name });

      if (!person) {
        return null;
      }

      person.phone = args.phone;

      try {
        await person.save();
      } catch (error) {
        throw new GraphQLError(`Saving number failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      return person;
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username });

      return user.save().catch((error) => {
        throw new GraphQLError(`creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, process.env.JWT_SECRET),
      };
    },

    addAsFriend: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      // Returns true if the person's id is not already in current user's friends list
      const noFriendAlready = (person) =>
        !currentUser.friends
          .map((f) => f._id.toString())
          .includes(person._id.toString());

      const person = await Person.findOne({ name: args.name });

      if (!person) {
        throw new GraphQLError("the name was not found", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      if (noFriendAlready(person)) {
        currentUser.friends = currentUser.friends.concat(person);
      }

      await currentUser.save();

      return currentUser;
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }

      await Person.deleteMany({});
      await User.deleteMany({});

      return true;
    },
  },

  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterableIterator("PERSON_ADDED"),
    },
  },
};

module.exports = resolvers;
