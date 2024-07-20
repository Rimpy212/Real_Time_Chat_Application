import { Client,Databases, Account} from 'appwrite';

export const PROJECT_ID='653b58719c39aa7bee70';
export const DATABASE_ID='653b5a5cbd61fff875e9';
export const COLLECTION_ID_MESSAGES='653b5a68af0911bf8738';

const client = new Client();


client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('653b58719c39aa7bee70');
export const databases = new Databases(client);
export const account = new Account(client);

export default client;