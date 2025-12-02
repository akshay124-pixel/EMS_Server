import bcrypt from 'bcryptjs';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { generateToken } from '../middleware/auth.js';
import { db } from '../data/database.js';

class AuthService {
  /**
   * User login
   */
  async login({ email, password }) {
    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token
      }
    };
  }

  /**
   * User registration
   */
  async register({ username, email, password, role = 'EMPLOYEE' }) {
    // Check if user exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      throw new UserInputError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      role,
      employeeId: null,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token
      }
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const user = db.users.find(u => u.id === id);
    if (!user) {
      throw new UserInputError('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
}

export const authService = new AuthService();
