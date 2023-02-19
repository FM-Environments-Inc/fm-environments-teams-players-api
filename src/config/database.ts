import { MONGO_DB, MONGO_USER, MONGO_PASSWORD, MONGO_PORT, MONGO_HOST } from './index';

// eslint-disable-next-line
require('dotenv').config();

export const DB_CONNECTION_STRING = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authMechanism=DEFAULT&authSource=admin`;
