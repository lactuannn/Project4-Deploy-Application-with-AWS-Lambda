import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { updateTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('http');

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    let todoId = event.pathParameters.todoId;
    let todo = JSON.parse(event.body);
    let userId = getUserId(event);
    todo = await updateTodo(userId, todoId, todo);
    logger.info('Update todo', {
      todoId,
      userId,
      todo
    });
    return {
      statusCode: 204,
      body: ''
    };
  });