import { Internship } from "src/db/entities/Internship.entity";
import { Permission } from "src/db/entities/Permission.entity";
import { Role } from "src/db/entities/Role.entity";
import { User } from "src/db/entities/User.entity";
import { DataSource } from "typeorm";
// import { Permission } from "../entities/Permission.entity";

const AppDataSourcee = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "test",
  // synchronize: true,
  logging: true,
  entities: [User, Internship, Role, Permission],
});

export default AppDataSourcee;
