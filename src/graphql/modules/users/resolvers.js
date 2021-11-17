import User from '../../../models/User';
import { USER_ADDED } from './channels';

export default {
  User: {
    fullName: (user) = `${user.firstName} ${user.lastName}`
  },
  Query: {
      users: () => User.find(),
      user: (_, { id }) => User.find(id),
  },
  Mutation: {
    createUser: async (_, { data }, { pubsub }) => {
      const user = await User.create(data);

      pubsub.publish(USER_ADDED, {
        userAdded: user
      })

      return user;
    },
    updateUser: (_, { id, data }) => User.findOneAndUpdate(id, data, { new: true }),
    deleteUser: async (_, { id }) => !!(await User.findOneAndDelete(id)),
  },
  Subscription: {
    userAdded:  {
      userAdded: {
        subscribe: (obj, args, { pubsub }) => pubsub.asyncInterator(USER_ADDED),
      }
    },
  },
};