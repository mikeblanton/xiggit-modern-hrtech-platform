'use strict';

const dynamoose = require('dynamoose');

dynamoose.model.defaults.set({ create: false });

const TABLE_NAME = process.env.USERS_TABLE;

const Schema = dynamoose.Schema;
const tableSchema = new Schema( {
  owner: {
    type: String,
    hashKey: true,
  },
  email: String,
  firstName: String,
  lastName: String,
}, {
  useDocumentTypes: true,
  timestamps: false,
});
const User = dynamoose.model(TABLE_NAME, tableSchema);

module.exports.get = async (userId) => {
  const record = await User.get(userId);
  if (!record) {
    const error = new Error('User not found');
    error.name = 'NotFound';
    error.statusCode = 404;
    throw error;
  }
  return record;
};
