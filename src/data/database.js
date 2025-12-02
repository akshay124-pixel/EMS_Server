import bcrypt from 'bcryptjs';

/**
 * In-memory database for demonstration
 * In production, replace with PostgreSQL, MongoDB, etc.
 */

// Sample employees data
const employees = [
  {
    id: 'emp_001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    age: 32,
    department: 'Engineering',
    position: 'Senior Software Engineer',
    salary: 125000,
    subjects: ['React', 'Node.js', 'GraphQL', 'TypeScript'],
    attendance: 96.5,
    joiningDate: '2020-03-15',
    phone: '+1-555-0101',
    address: '123 Tech Street, San Francisco, CA',
    status: 'ACTIVE',
    flagged: false,
    createdAt: '2020-03-15T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_002',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    age: 28,
    department: 'Engineering',
    position: 'Full Stack Developer',
    salary: 95000,
    subjects: ['Vue.js', 'Python', 'Docker', 'AWS'],
    attendance: 94.2,
    joiningDate: '2021-06-01',
    phone: '+1-555-0102',
    address: '456 Innovation Ave, Seattle, WA',
    status: 'ACTIVE',
    flagged: false,
    createdAt: '2021-06-01T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    age: 35,
    department: 'Product',
    position: 'Product Manager',
    salary: 135000,
    subjects: ['Product Strategy', 'Agile', 'User Research', 'Analytics'],
    attendance: 98.1,
    joiningDate: '2019-01-10',
    phone: '+1-555-0103',
    address: '789 Product Lane, Austin, TX',
    status: 'ACTIVE',
    flagged: false,
    createdAt: '2019-01-10T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_004',
    name: 'David Kim',
    email: 'david.kim@company.com',
    age: 29,
    department: 'Design',
    position: 'UI/UX Designer',
    salary: 88000,
    subjects: ['Figma', 'User Experience', 'Prototyping', 'Design Systems'],
    attendance: 92.8,
    joiningDate: '2021-09-20',
    phone: '+1-555-0104',
    address: '321 Design Blvd, New York, NY',
    status: 'ACTIVE',
    flagged: true,
    createdAt: '2021-09-20T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_005',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@company.com',
    age: 31,
    department: 'Engineering',
    position: 'DevOps Engineer',
    salary: 115000,
    subjects: ['Kubernetes', 'CI/CD', 'Terraform', 'Monitoring'],
    attendance: 97.3,
    joiningDate: '2020-08-12',
    phone: '+1-555-0105',
    address: '654 Cloud Drive, Denver, CO',
    status: 'ACTIVE',
    flagged: false,
    createdAt: '2020-08-12T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_006',
    name: 'Robert Taylor',
    email: 'robert.taylor@company.com',
    age: 42,
    department: 'Engineering',
    position: 'Engineering Manager',
    salary: 165000,
    subjects: ['Leadership', 'Architecture', 'Mentoring', 'Strategy'],
    attendance: 95.7,
    joiningDate: '2018-02-01',
    phone: '+1-555-0106',
    address: '987 Management St, Boston, MA',
    status: 'ACTIVE',
    flagged: false,
    createdAt: '2018-02-01T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_007',
    name: 'Amanda White',
    email: 'amanda.white@company.com',
    age: 27,
    department: 'Marketing',
    position: 'Digital Marketing Specialist',
    salary: 72000,
    subjects: ['SEO', 'Content Marketing', 'Social Media', 'Analytics'],
    attendance: 93.5,
    joiningDate: '2022-04-15',
    phone: '+1-555-0107',
    address: '147 Marketing Way, Chicago, IL',
    status: 'ACTIVE',
    flagged: false,
    createdAt: '2022-04-15T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_008',
    name: 'James Anderson',
    email: 'james.anderson@company.com',
    age: 38,
    department: 'Sales',
    position: 'Sales Director',
    salary: 145000,
    subjects: ['Enterprise Sales', 'Negotiation', 'CRM', 'Strategy'],
    attendance: 91.2,
    joiningDate: '2019-07-22',
    phone: '+1-555-0108',
    address: '258 Sales Plaza, Miami, FL',
    status: 'ON_LEAVE',
    flagged: false,
    createdAt: '2019-07-22T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_009',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    age: 30,
    department: 'HR',
    position: 'HR Manager',
    salary: 92000,
    subjects: ['Recruitment', 'Employee Relations', 'Benefits', 'Compliance'],
    attendance: 96.8,
    joiningDate: '2020-11-05',
    phone: '+1-555-0109',
    address: '369 HR Avenue, Portland, OR',
    status: 'ACTIVE',
    flagged: false,
    createdAt: '2020-11-05T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_010',
    name: 'Christopher Lee',
    email: 'christopher.lee@company.com',
    age: 33,
    department: 'Engineering',
    position: 'Backend Developer',
    salary: 105000,
    subjects: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
    attendance: 94.9,
    joiningDate: '2021-01-18',
    phone: '+1-555-0110',
    address: '741 Backend Road, Phoenix, AZ',
    status: 'ACTIVE',
    flagged: false,
    createdAt: '2021-01-18T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_011',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    age: 26,
    department: 'Design',
    position: 'Graphic Designer',
    salary: 68000,
    subjects: ['Adobe Creative Suite', 'Branding', 'Illustration', 'Typography'],
    attendance: 89.4,
    joiningDate: '2022-08-30',
    phone: '+1-555-0111',
    address: '852 Creative Circle, Los Angeles, CA',
    status: 'ACTIVE',
    flagged: true,
    createdAt: '2022-08-30T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  },
  {
    id: 'emp_012',
    name: 'Daniel Brown',
    email: 'daniel.brown@company.com',
    age: 36,
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 98000,
    subjects: ['Financial Modeling', 'Excel', 'Forecasting', 'Reporting'],
    attendance: 97.6,
    joiningDate: '2019-12-10',
    phone: '+1-555-0112',
    address: '963 Finance Street, Philadelphia, PA',
    status: 'ACTIVE',
    flagged: false,
    createdAt: '2019-12-10T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z'
  }
];

// Sample users (pre-hashed passwords)
const users = [
  {
    id: 'user_001',
    username: 'admin',
    email: 'admin@company.com',
    password: bcrypt.hashSync('admin123', 10), // Password: admin123
    role: 'ADMIN',
    employeeId: null,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'user_002',
    username: 'sarah',
    email: 'sarah.johnson@company.com',
    password: bcrypt.hashSync('employee123', 10), // Password: employee123
    role: 'EMPLOYEE',
    employeeId: 'emp_001',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'user_003',
    username: 'robert',
    email: 'robert.taylor@company.com',
    password: bcrypt.hashSync('manager123', 10), // Password: manager123
    role: 'MANAGER',
    employeeId: 'emp_006',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

export const db = {
  employees,
  users
};
