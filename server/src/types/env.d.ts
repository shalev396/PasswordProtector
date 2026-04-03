export type Env = 'dev' | 'qa' | 'prod';
export type DatabaseProvider = 'sequelize' | 'mongoose';
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: Env;
      AWS_REGION: string;
      DATABASE_URL: string;
      DATABASE_URL_LOCAL?: string;
      IS_OFFLINE?: string;
      DATABASE_PROVIDER: DatabaseProvider;
      S3_CLIENT_BUCKET_NAME: string;
      COGNITO_CLIENT_ID: string;
      COGNITO_USER_POOL_ID: string;
      COGNITO_ISSUER: string;
      DOMAIN_NAME: string;
      LAMBDA_SECURITY_GROUP_ID: string;
      LAMBDA_SUBNET_ID: string;
      SERVER_ENCRYPTION_SECRET: string;
    }
  }
}

export {};
