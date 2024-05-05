import { createLogger } from '../utils/logger.mjs';
import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

const logger = createLogger('dataLayer');

const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const todosIndex = process.env.INDEX_NAME;

export class TodosAccess {

    async getTodos(userId) {
        const result = await docClient.query({
            TableName: todosTable,
            IndexName: todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
        return result.Items;
    }

    async createTodo(todo) {
        await docClient.put({
            TableName: todosTable,
            Item: todo
        }).promise();
        return todo;
    }

    async updateTodo(userId, todoId, todo) {
        await docClient.update({
            TableName: todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todo.name,
                ':dueDate': todo.dueDate,
                ':done': todo.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();
        return todo;
    }

    async deleteTodo(todoId, userId) {
        const result = await docClient.delete({
            TableName: todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise();
        return result;
    }

    async updateTodoAttachmentUrl(todoId, userId, attachmentUrl) {
        await docClient.update({
            TableName: todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        }).promise();
    }
}