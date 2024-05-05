import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { deleteTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('http');

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    let todoId = event.pathParameters.todoId;
    let userId = getUserId(event);
    await deleteTodo(todoId, userId);
    logger.info('Delete todo', {
      todoId,
      userId
    });
    return {
      statusCode: 204,
      body: ''
    };
  });