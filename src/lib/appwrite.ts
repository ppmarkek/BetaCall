import { Client, Account } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67b999f8003632e8beb2'); 

const account = new Account(client);

export { client, account };
