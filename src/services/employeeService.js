import { UserInputError } from 'apollo-server-express';
import { db } from '../data/database.js';
import { cache } from '../utils/cache.js';

class EmployeeService {
  /**
   * Get employee by ID with caching
   */
  async getEmployeeById(id) {
    const cacheKey = `employee:${id}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const employee = db.employees.find(e => e.id === id);
    
    if (!employee) {
      throw new UserInputError('Employee not found');
    }

    cache.set(cacheKey, employee);
    return employee;
  }

  /**
   * List employees with optional filtering
   */
  async listEmployees(filter = {}) {
    let employees = [...db.employees];

    // Apply filters
    if (filter.name) {
      employees = employees.filter(e => 
        e.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    if (filter.department) {
      employees = employees.filter(e => 
        e.department.toLowerCase() === filter.department.toLowerCase()
      );
    }

    if (filter.position) {
      employees = employees.filter(e => 
        e.position.toLowerCase().includes(filter.position.toLowerCase())
      );
    }

    if (filter.status) {
      employees = employees.filter(e => e.status === filter.status);
    }

    if (filter.minAge) {
      employees = employees.filter(e => e.age >= filter.minAge);
    }

    if (filter.maxAge) {
      employees = employees.filter(e => e.age <= filter.maxAge);
    }

    if (filter.minSalary) {
      employees = employees.filter(e => e.salary >= filter.minSalary);
    }

    if (filter.maxSalary) {
      employees = employees.filter(e => e.salary <= filter.maxSalary);
    }

    if (filter.flagged !== undefined) {
      employees = employees.filter(e => e.flagged === filter.flagged);
    }

    return employees;
  }

  /**
   * Get paginated employees with sorting
   */
  async getPaginatedEmployees(page = 1, limit = 10, filter = {}, sort = null) {
    // Get filtered employees
    let employees = await this.listEmployees(filter);

    // Apply sorting
    if (sort) {
      employees.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];
        
        let comparison = 0;
        if (aVal > bVal) comparison = 1;
        if (aVal < bVal) comparison = -1;
        
        return sort.order === 'DESC' ? -comparison : comparison;
      });
    }

    // Calculate pagination
    const totalCount = employees.length;
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const paginatedEmployees = employees.slice(offset, offset + limit);

    return {
      employees: paginatedEmployees,
      totalCount,
      pageInfo: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  /**
   * Create new employee
   */
  async createEmployee(input) {
    // Validate email uniqueness
    const existingEmployee = db.employees.find(e => e.email === input.email);
    if (existingEmployee) {
      throw new UserInputError('Employee with this email already exists');
    }

    const newEmployee = {
      id: `emp_${Date.now()}`,
      ...input,
      status: input.status || 'ACTIVE',
      flagged: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.employees.push(newEmployee);
    
    // Invalidate cache
    cache.flushAll();
    
    return newEmployee;
  }

  /**
   * Update employee
   */
  async updateEmployee(id, input) {
    const employeeIndex = db.employees.findIndex(e => e.id === id);
    
    if (employeeIndex === -1) {
      throw new UserInputError('Employee not found');
    }

    // Check email uniqueness if email is being updated
    if (input.email) {
      const existingEmployee = db.employees.find(
        e => e.email === input.email && e.id !== id
      );
      if (existingEmployee) {
        throw new UserInputError('Employee with this email already exists');
      }
    }

    const updatedEmployee = {
      ...db.employees[employeeIndex],
      ...input,
      updatedAt: new Date().toISOString()
    };

    db.employees[employeeIndex] = updatedEmployee;
    
    // Invalidate cache
    cache.del(`employee:${id}`);
    
    return updatedEmployee;
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id) {
    const employeeIndex = db.employees.findIndex(e => e.id === id);
    
    if (employeeIndex === -1) {
      throw new UserInputError('Employee not found');
    }

    db.employees.splice(employeeIndex, 1);
    
    // Invalidate cache
    cache.del(`employee:${id}`);
    
    return true;
  }

  /**
   * Toggle employee flag status
   */
  async toggleFlag(id) {
    const employee = await this.getEmployeeById(id);
    return this.updateEmployee(id, { flagged: !employee.flagged });
  }

  /**
   * Bulk delete employees
   */
  async bulkDelete(ids) {
    let deletedCount = 0;
    
    for (const id of ids) {
      const employeeIndex = db.employees.findIndex(e => e.id === id);
      if (employeeIndex !== -1) {
        db.employees.splice(employeeIndex, 1);
        cache.del(`employee:${id}`);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }

  /**
   * Get employee statistics
   */
  async getEmployeeStats() {
    const employees = db.employees;
    const activeEmployees = employees.filter(e => e.status === 'ACTIVE');
    
    const totalAge = employees.reduce((sum, e) => sum + e.age, 0);
    const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
    
    // Department distribution
    const deptMap = {};
    employees.forEach(e => {
      deptMap[e.department] = (deptMap[e.department] || 0) + 1;
    });
    
    const departmentDistribution = Object.entries(deptMap).map(([dept, count]) => ({
      department: dept,
      count
    }));

    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      averageAge: employees.length > 0 ? totalAge / employees.length : 0,
      averageSalary: employees.length > 0 ? totalSalary / employees.length : 0,
      departmentDistribution
    };
  }
}

export const employeeService = new EmployeeService();
