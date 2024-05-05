import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { getTodos } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('http');

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    let userId = getUserId(event);
    let todos = await getTodos(userId);
    logger.info('Get todos', {
      userId,
      todos
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    };
  });