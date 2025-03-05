import { client, account } from '@/lib/appwrite';
import { Client, Account } from 'appwrite';

describe('Appwrite client setup', () => {
  test('Client has the correct endpoint', () => {
    expect(client.config.endpoint).toBe('https://cloud.appwrite.io/v1');
  });

  test('Client has the correct project ID', () => {
    expect(client.config.project).toBe('67b999f8003632e8beb2');
  });

  test('Account is instantiated with the configured client', () => {
    expect(account).toBeInstanceOf(Account);
    expect(account.client).toBeInstanceOf(Client);
    expect(account.client.config.endpoint).toBe('https://cloud.appwrite.io/v1');
  });
});
