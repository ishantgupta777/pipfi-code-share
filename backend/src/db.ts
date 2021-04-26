import { createConnection } from "typeorm";
import { join } from "path";
require("dotenv-safe").config();
const isProductionEnvironment = process.env.NODE_ENV === "production";

export default async ()=>{
  createConnection({
    type: "postgres",
    database: process.env.DATABASE ||  "pipfi",
    entities: [join(__dirname, "./entities/*.*")],
    username: process.env.USERNAME || 'postgres',
    password: process.env.PASSWORD || 'postgres',
    port: 5432,
    host: process.env.HOST ||  'postgres',
    logging: !isProductionEnvironment,
    synchronize: !isProductionEnvironment,
    extra:{ssl: true}
  })
}