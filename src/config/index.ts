// eslint-disable-next-line
require('dotenv').config();

export const MONGO_DB = process.env.MONGO_DB || 'fm-environments-teams-players';
export const MONGO_USER = process.env.MONGO_USER || 'root';
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
export const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
export const MONGO_PORT = process.env.MONGO_PORT || 27017;
