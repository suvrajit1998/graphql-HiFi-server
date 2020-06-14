const postResolvers = require('./post')
const userResolvers = require('./users')
const CommentResolvers = require('./comment')

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...CommentResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
}
