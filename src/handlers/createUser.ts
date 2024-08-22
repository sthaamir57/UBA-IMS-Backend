// Assuming this runs after AppDataSource.initialize() has been called

import AppDataSourcee from "src/db/datasource/dataSource";
import { Role } from "src/db/entities/Role.entity";
import { User } from "src/db/entities/User.entity";

export async function createUser(
  username: string,
  email: string,
  name: string,
  plainPassword: string,
  roleId: number = 2
) {
  const userRepo = AppDataSourcee.getRepository(User);
  const roleRepo = AppDataSourcee.getRepository(Role);

  // Fetch the role entity by ID
  const role = await roleRepo.findOneBy({ id: roleId });
  if (!role) {
    throw new Error("Role not found");
  }

  const user = new User();
  user.username = username;
  user.email = email;
  user.name = name;
  await user.setPassword(plainPassword); // Hash the plain password
  user.role = role;

  await userRepo.save(user); // Save the user to the database
  console.log("User created:", user);
}
