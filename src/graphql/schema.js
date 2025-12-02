import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # ============================================
  # TYPES
  # ============================================
  
  type Employee {
    id: ID!
    name: String!
    email: String!
    age: Int!
    department: String!
    position: String!
    salary: Float!
    subjects: [String!]!
    attendance: Float!
    joiningDate: String!
    phone: String
    address: String
    status: EmployeeStatus!
    flagged: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: UserRole!
    token: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PaginatedEmployees {
    employees: [Employee!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo {
    currentPage: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # ============================================
  # ENUMS
  # ============================================
  
  enum EmployeeStatus {
    ACTIVE
    INACTIVE
    ON_LEAVE
  }

  enum UserRole {
    ADMIN
    EMPLOYEE
    MANAGER
  }

  enum SortOrder {
    ASC
    DESC
  }

  enum EmployeeSortField {
    name
    age
    salary
    joiningDate
    attendance
  }

  # ============================================
  # INPUTS
  # ============================================
  
  input EmployeeFilterInput {
    name: String
    department: String
    position: String
    status: EmployeeStatus
    minAge: Int
    maxAge: Int
    minSalary: Float
    maxSalary: Float
    flagged: Boolean
  }

  input EmployeeSortInput {
    field: EmployeeSortField!
    order: SortOrder!
  }

  input CreateEmployeeInput {
    name: String!
    email: String!
    age: Int!
    department: String!
    position: String!
    salary: Float!
    subjects: [String!]!
    attendance: Float!
    joiningDate: String!
    phone: String
    address: String
    status: EmployeeStatus
  }

  input UpdateEmployeeInput {
    name: String
    email: String
    age: Int
    department: String
    position: String
    salary: Float
    subjects: [String!]
    attendance: Float
    joiningDate: String
    phone: String
    address: String
    status: EmployeeStatus
    flagged: Boolean
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: UserRole
  }

  # ============================================
  # QUERIES
  # ============================================
  
  type Query {
    """
    Get a single employee by ID
    """
    employee(id: ID!): Employee

    """
    List all employees with optional filtering
    """
    listEmployees(filter: EmployeeFilterInput): [Employee!]!

    """
    Get paginated employees with sorting and filtering
    """
    paginatedEmployees(
      page: Int = 1
      limit: Int = 10
      filter: EmployeeFilterInput
      sort: EmployeeSortInput
    ): PaginatedEmployees!

    """
    Get current authenticated user
    """
    me: User

    """
    Get employee statistics
    """
    employeeStats: EmployeeStats!
  }

  type EmployeeStats {
    totalEmployees: Int!
    activeEmployees: Int!
    averageAge: Float!
    averageSalary: Float!
    departmentDistribution: [DepartmentStat!]!
  }

  type DepartmentStat {
    department: String!
    count: Int!
  }

  # ============================================
  # MUTATIONS
  # ============================================
  
  type Mutation {
    """
    User authentication - login
    """
    login(input: LoginInput!): AuthPayload!

    """
    User registration
    """
    register(input: RegisterInput!): AuthPayload!

    """
    Create a new employee (Admin only)
    """
    addEmployee(input: CreateEmployeeInput!): Employee!

    """
    Update an existing employee
    """
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!

    """
    Delete an employee (Admin only)
    """
    deleteEmployee(id: ID!): Boolean!

    """
    Toggle flag status on employee
    """
    toggleEmployeeFlag(id: ID!): Employee!

    """
    Bulk delete employees (Admin only)
    """
    bulkDeleteEmployees(ids: [ID!]!): Int!
  }
`;
