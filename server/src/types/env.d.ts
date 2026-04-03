declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'qa' | 'prod';
      AWS_REGION: string;
      DATABASE_URL: string;
      DATABASE_URL_LOCAL?: string;
      IS_OFFLINE?: string;
      DATABASE_PROVIDER: 'mongoose' | 'sequelize';
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
