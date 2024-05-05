import { createLogger } from '../utils/logger.mjs';
import { TodosAccess } from '../dataLayer/todosAccess.mjs';
import { uuid } from 'uuidv4';
import { S3AttachmentUtils } from '../fileStorage/s3AttachmentUtils.mjs';

const logger = createLogger('businessLogic');
const todosAccess = new TodosAccess();
const s3AttachmentUtils = new S3AttachmentUtils();

export async function getTodos(userId) {
    return todosAccess.getTodos(userId);
}

export async function createTodo(todo, userId) {
    const todoId = uuid();
    const createdAt = new Date().toISOString();
    const attachmentUrl = s3AttachmentUtils.getAttachmentUrl(todoId);
    const newTodo = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl,
        ...todo
    };
    return todosAccess.createTodo(newTodo);
}

export async function updateTodo(userId, todoId, todo) {
    return todosAccess.updateTodo(userId, todoId, todo);
}

export async function deleteTodo(todoId, userId) {
    return todosAccess.deleteTodo(todoId, userId);
}

export async function createAttachmentPresignedUrl(todoId) {
    return s3AttachmentUtils.getUploadUrl(todoId);
}