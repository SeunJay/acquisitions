import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('password hashing failed ', error);
    throw new Error('password hashing failed ');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Password comparison failed ', error);
    throw new Error('Password comparison failed');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const isValidPassword = await comparePassword(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    logger.info(
      `User with email ${existingUser.email} authenticated successfully!`
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = existingUser;
    return userWithoutPassword;
  } catch (error) {
    logger.error('Error authenticating user ', error);
    throw error; // Re-throw to preserve specific error messages
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User with email of ${newUser.email} created successfully!`);

    return newUser;
  } catch (error) {
    logger.error('Error creating a user ', error);
    throw error;
  }
};
