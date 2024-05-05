import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('http');

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    let todo = JSON.parse(event.body);
    let userId = getUserId(event);
    todo = await createTodo(todo, userId);
    logger.info('Create todo', {
      todo,
      userId
    });
    return {
      statusCode: 201,
      body: JSON.stringify({ item: todo })
    };
  });