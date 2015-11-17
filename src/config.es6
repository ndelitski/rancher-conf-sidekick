import path from 'path';
import fs from 'fs';
import {promisify} from 'bluebird';
import {info} from './log';
import axios from 'axios';

const readFile = promisify(fs.readFile);
const DEFAULT_CONFIG_FILE = path.join(__dirname, '../config.json');

export default (async function resolveConfig() {
  if (fs.existsSync(DEFAULT_CONFIG_FILE)) {
    info(`reading config from file ${DEFAULT_CONFIG_FILE}`);
    return await fileSource(DEFAULT_CONFIG_FILE);
  } else {
    info('trying to compose config from env variables');
    return await envSource();
  }
})()

async function fileSource(filePath) {
  const contents = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(contents);
  return parsed;
}

async function envSource() {
  const {
    REDIS_HOST,
    REDIS_PORT,
    CONFR_INTERVAL,
    CONFR_DOCKER_SOCKET
  } = process.env;

  return {
    redis: {
      host: REDIS_HOST,
      port: REDIS_PORT || 6379
    },
    interval: CONFR_INTERVAL || 5000,
    docker: {
      socket: CONFR_DOCKER_SOCKET || '/var/run/docker.sock'
    }
  }
}
