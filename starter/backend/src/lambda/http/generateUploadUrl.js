import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createAttachmentPresignedUrl } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('http');

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    let todoId = event.pathParameters.todoId;
    let url = await createAttachmentPresignedUrl(todoId);
    logger.info('Generate Upload URL', {
      todoId,
      url
    });
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    };
  });
