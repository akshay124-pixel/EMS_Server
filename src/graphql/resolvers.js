import { employeeService } from '../services/employeeService.js';
import { authService } from '../services/authService.js';
import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';

// Authorization helper
const requireAuth = (user) => {
  if (!user) {
    throw new AuthenticationError('You must be logged in');
  }
};

const requireAdmin = (user) => {
  requireAuth(user);
  if (user.role !== 'ADMIN') {
    throw new ForbiddenError('Admin access required');
  }
};

export const resolvers = {
  Query: {
    // Get single employee
    employee: async (_, { id }, { user, loaders }) => {
      requireAuth(user);
      return loaders.employeeLoader.load(id);
    },

    // List all employees with filtering
    listEmployees: async (_, { filter }, { user }) => {
      requireAuth(user);
      return employeeService.listEmployees(filter);
    },

    // Paginated employees with sorting
    paginatedEmployees: async (_, { page, limit, filter, sort }, { user }) => {
      requireAuth(user);
      
      // Validate pagination params
      if (page < 1) throw new UserInputError('Page must be >= 1');
      if (limit < 1 || limit > 100) throw new UserInputError('Limit must be between 1 and 100');
      
      return employeeService.getPaginatedEmployees(page, limit, filter, sort);
    },

    // Get current user
    me: async (_, __, { user }) => {
      requireAuth(user);
      return authService.getUserById(user.id);
    },

    // Get employee statistics
    employeeStats: async (_, __, { user }) => {
      requireAuth(user);
      return employeeService.getEmployeeStats();
    }
  },

  Mutation: {
    // Authentication
    login: async (_, { input }) => {
      return authService.login(input);
    },

    register: async (_, { input }) => {
      return authService.register(input);
    },

    // Create employee
    addEmployee: async (_, { input }, { user }) => {
      requireAdmin(user);
      return employeeService.createEmployee(input);
    },

    // Update employee
    updateEmployee: async (_, { id, input }, { user }) => {
      requireAuth(user);
      
      // Employees can only update their own record
      if (user.role === 'EMPLOYEE' && user.employeeId !== id) {
        throw new ForbiddenError('You can only update your own record');
      }
      
      return employeeService.updateEmployee(id, input);
    },

    // Delete employee
    deleteEmployee: async (_, { id }, { user }) => {
      requireAdmin(user);
      return employeeService.deleteEmployee(id);
    },

    // Toggle flag
    toggleEmployeeFlag: async (_, { id }, { user }) => {
      requireAuth(user);
      return employeeService.toggleFlag(id);
    },

    // Bulk delete
    bulkDeleteEmployees: async (_, { ids }, { user }) => {
      requireAdmin(user);
      return employeeService.bulkDelete(ids);
    }
  },

  // Field resolvers for computed properties
  Employee: {
    // Example: format dates or compute derived fields
    joiningDate: (parent) => {
      return parent.joiningDate;
    }
  }
};
