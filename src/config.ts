import dotenv from "dotenv";

dotenv.config();

const config = {
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
  },
  jwt_secret: {
    admin: process.env.ADMIN_JWT_SECRET,
    company_user: process.env.COMPANY_USER_JWT_SECRET,
  },
  salt_round: Number(process.env.SALT_ROUNDS),
  production: process.env.PRODUCTION === "true",
  port: Number(process.env.PORT),
  url: process.env.URL
};

export default config;