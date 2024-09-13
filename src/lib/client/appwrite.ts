import { Client, Account } from 'appwrite';

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;

export const client = new Client();

client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

export const account = new Account(client);
export { ID } from 'appwrite';
