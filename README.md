# Task Tracker API

Task Tracker API is a simple backend project built using **NestJS**, **Prisma**, and **PostgreSQL**.   
It includes user authentication, task management (CRUD operations), and Swagger documentation for easy API testing. More features will be added soon!!!

## Tech Stack
- **Framework:** NestJS  
- **ORM:** Prisma  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **Documentation:** Swagger  

## Features
- User signup and signin  
- JWT-based authentication and authorization  
- Complete CRUD for tasks  
- Only logged-in users can access task APIs  
- Swagger UI for testing and documentation  

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/pratikSondaule/task-tracker-api.git
cd task-tracker-api
```

### 2. Install dependencies
```bash
npm install
```
### 3. Add environment variables
```bash
DATABASE_URL="your_postgres_database_url"
PORT=3000
JWT_SECRET="your_jwt_secret"
SMTP_EMAIL="your_smtp_email"
SMTP_PASSWORD="your_smtp_password"
```
### 4. Run database migrations
```bash
npm run db:migrate
```
### 5. Start the application
```bash
npm start
```
## Swagger API Documentation
- http://localhost:3000/docs
