# Employee Management System - Backend

Enterprise-grade GraphQL API with JWT authentication, role-based access control, and performance optimizations.

## 🚀 Features

- **GraphQL API** with Apollo Server
- **JWT Authentication** with bcrypt password hashing
- **Role-Based Access Control** (Admin, Manager, Employee)
- **Performance Optimizations**:
  - DataLoader for batching and caching
  - NodeCache for query result caching
  - Pagination with efficient indexing
  - Query cost control
- **Advanced Queries**:
  - Filtering, sorting, pagination
  - Employee statistics
  - Bulk operations
- **Security**:
  - Password hashing with bcrypt
  - JWT token validation
  - Input validation
  - CORS protection

## 📦 Installation

```bash
cd backend
npm install
```

## 🔧 Configuration

Create a `.env` file:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 🏃 Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🔐 Default Users

| Email | Password | Role |
|-------|----------|------|
| admin@company.com | admin123 | ADMIN |
| sarah.johnson@company.com | employee123 | EMPLOYEE |
| robert.taylor@company.com | manager123 | MANAGER |

## 📊 GraphQL Playground

Access the GraphQL Playground at: `http://localhost:4000/graphql`

### Sample Queries

**Login:**
```graphql
mutation {
  login(input: {
    email: "admin@company.com"
    password: "admin123"
  }) {
    token
    user {
      id
      username
      role
    }
  }
}
```

**Get Paginated Employees:**
```graphql
query {
  paginatedEmployees(
    page: 1
    limit: 10
    sort: { field: name, order: ASC }
  ) {
    employees {
      id
      name
      email
      department
      position
      salary
    }
    totalCount
    pageInfo {
      currentPage
      totalPages
      hasNextPage
    }
  }
}
```

**Add Employee (Admin only):**
```graphql
mutation {
  addEmployee(input: {
    name: "John Doe"
    email: "john.doe@company.com"
    age: 30
    department: "Engineering"
    position: "Software Engineer"
    salary: 90000
    subjects: ["JavaScript", "React"]
    attendance: 95.0
    joiningDate: "2024-01-15"
  }) {
    id
    name
    email
  }
}
```

## 🏗️ Architecture

```
backend/
├── src/
│   ├── data/
│   │   └── database.js          # In-memory database
│   ├── graphql/
│   │   ├── schema.js            # GraphQL type definitions
│   │   └── resolvers.js         # GraphQL resolvers
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── services/
│   │   ├── authService.js       # Authentication logic
│   │   └── employeeService.js   # Employee business logic
│   ├── utils/
│   │   ├── cache.js             # Caching layer
│   │   └── dataLoaders.js       # DataLoader for batching
│   └── server.js                # Express + Apollo Server
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚢 Deployment

### Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables
5. Deploy!

Build Command: `npm install`
Start Command: `npm start`

### Deploy to Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

## 🔒 Security Best Practices

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting
- Add request validation
- Enable CORS only for trusted origins
- Use environment variables for sensitive data

## 📈 Performance Optimizations

1. **DataLoader**: Batches and caches database requests
2. **NodeCache**: Caches frequently accessed data
3. **Pagination**: Limits query results
4. **Indexing**: Efficient data retrieval
5. **Query Complexity**: Prevents expensive queries

## 🧪 Testing

Add authentication header to all protected queries:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 📝 License

MIT
