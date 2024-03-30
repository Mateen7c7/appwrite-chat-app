import { Client, Databases } from "appwrite";

export const PROJECT_ID = "660519422c4d10e82401";
export const Database_ID = "660519f47daf74d97400";
export const COLLECTION_ID_MESSAGES = "66051a058da1ff5b18bb";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("660519422c4d10e82401");

export const databases = new Databases(client);
