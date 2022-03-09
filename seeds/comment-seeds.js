const { Comment } = require('../models');

const commentdata = [
  {
    comment_text: 'one.',
    user_id: 6,
    post_id: 1
  },
  {
    comment_text: 'two',
    user_id: 6,
    post_id: 8
  },
  {
    comment_text: 'tree.',
    user_id: 3,
    post_id: 10
  },
  {
    comment_text: 'four',
    user_id: 3,
    post_id: 18
  },
  {
    comment_text: 'five',
    user_id: 7,
    post_id: 5
  },
  {
    comment_text: 'six',
    user_id: 1,
    post_id: 20
  },
  {
    comment_text: 'seven',
    user_id: 6,
    post_id: 7
  },
  {
    comment_text: 'eight',
    user_id: 7,
    post_id: 4
  },
  {
    comment_text: 'nine',
    user_id: 6,
    post_id: 12
  },
  {
    comment_text: 'ten',
    user_id: 6,
    post_id: 20
  },
  {
    comment_text: 'eleven',
    user_id: 3,
    post_id: 14
  },
  {
    comment_text: 'twelve',
    user_id: 5,
    post_id: 4
  },
];

const seedComments = () => Comment.bulkCreate(commentdata);

module.exports = seedComments;
