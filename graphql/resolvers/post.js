const Post = require('../../model/posts')
const authCheck = require('../../util/check-auth')

const { AuthenticationError, UserInputError } = require('apollo-server')

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 })
        return posts
      } catch (err) {
        throw new Error(err)
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId)
        if (post) {
          return post
        } else {
          throw new Error('Post not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = authCheck(context)

      if (body.trim() === '') {
        throw new Error('Post body must not be empty')
      }
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      })

      const post = await newPost.save()

      context.pubsub.publish('NEW_POST', {
        newPost: post,
      })

      return post
    },

    async deletepost(_, { postId }, context) {
      const user = authCheck(context)

      try {
        const post = await Post.findById(postId)
        if (user.username === post.username) {
          await post.delete()
          return 'Post delete successfully'
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    likePost: async (_, { postId }, context) => {
      const { username } = authCheck(context)

      const post = await Post.findById(postId)

      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username)
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          })
        }

        await post.save()
        return post
      } else throw new UserInputError('Post not found')
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
    },
  },
}
