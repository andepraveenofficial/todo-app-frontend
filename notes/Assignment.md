# Todo Web Application Assignment

## Objective
Develop a Todo Web Application where users can manage their daily tasks by storing them and updating their status. The application should support user authentication, task management, and profile management.

## Technologies

The following technologies are required for this project:

1. **ReactJS** (Frontend)
2. **Node.js**, **Express** (Backend API)
3. **JWT** for authentication
4. **UUID** for generating a unique ID
5. **SQLite3** or **MongoDB** for database management

## Functional Requirements

### 1. User Authentication:
- **Signup**: Implement a Signup feature where new users can register by providing the necessary details.
- **Login**: Implement a Login feature where registered users can authenticate themselves using JWT tokens.
- **JWT Token Validation**: Secure the API routes by validating the JWT token to ensure that only authenticated users can access certain features.

### 2. Todo Management:
- **CRUD Operations**: Implement Create, Read, Update, Delete (CRUD) operations for managing daily tasks.
    - Users should be able to:
        - Add new tasks
        - View their list of tasks
        - Edit existing tasks
        - Delete tasks they no longer need
- **Task Status Update**: Enable users to update the status of each task. The available statuses should include:
    - "done"
    - "pending"
    - "in progress"
    - "completed"

### 3. User Profile Management:
- **CRUD Operations**: Implement CRUD operations to manage the user’s profile.
    - Users should be able to:
        - Update their profile information (e.g., name, email, password)
- **Profile Access**: Ensure that profile updates are only accessible to the authenticated user.

## Assignment Submission Guidelines:

1. Submit your **Github Repository** link.
2. Submit your **Deployed Application** link.
3. Submit your **Loom Video** recording explaining your project.
