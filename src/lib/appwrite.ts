import { Client, Account } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67d3036900280982955e'); 

const account = new Account(client);

export { client, account };
