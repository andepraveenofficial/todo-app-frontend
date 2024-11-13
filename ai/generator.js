// generator.js
const fs = require('fs');
const path = require('path');

const srcPath = path.join(process.cwd(), 'src');
const apiV1Path = path.join(srcPath, 'api', 'v1');

const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const createFile = (filePath, content) => {
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
};

// File contents
const files = {
  // Models
  'models/todo.model.js': `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma.todo;`,

  'models/index.js': `module.exports = {
  TodoModel: require('./todo.model'),
  UserModel: require('./user.model')
};`,

  // DTOs
  'dtos/todo.dto.js': `/**
 * @typedef {Object} CreateTodoDto
 * @property {string} title
 * @property {string} [description]
 * @property {'pending' | 'in progress' | 'done' | 'completed'} status
 */

/**
 * @typedef {Object} UpdateTodoDto
 * @property {string} [title]
 * @property {string} [description]
 * @property {'pending' | 'in progress' | 'done' | 'completed'} [status]
 */

module.exports = {};`,

  'dtos/profile.dto.js': `/**
 * @typedef {Object} UpdateProfileDto
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [password]
 */

module.exports = {};`,

  // Repositories
  'repositories/todo.repository.js': `const prisma = require('../../../config/prisma');

const createTodo = async (userId, data) => {
  return await prisma.todo.create({
    data: {
      ...data,
      userId
    }
  });
};

const findTodosByUserId = async (userId) => {
  return await prisma.todo.findMany({
    where: { userId }
  });
};

const findTodoById = async (id) => {
  return await prisma.todo.findUnique({
    where: { id }
  });
};

const updateTodo = async (id, data) => {
  return await prisma.todo.update({
    where: { id },
    data
  });
};

const deleteTodo = async (id) => {
  return await prisma.todo.delete({
    where: { id }
  });
};

module.exports = {
  createTodo,
  findTodosByUserId,
  findTodoById,
  updateTodo,
  deleteTodo
};`,

  // Services
  'services/todo.service.js': `const todoRepository = require('../repositories/todo.repository');
const ApiError = require('../../../handlers/apiError.handler');

const createTodo = async (userId, data) => {
  return await todoRepository.createTodo(userId, data);
};

const getTodos = async (userId) => {
  return await todoRepository.findTodosByUserId(userId);
};

const updateTodo = async (todoId, userId, data) => {
  const todo = await todoRepository.findTodoById(todoId);
  
  if (!todo) {
    throw new ApiError(404, 'Todo not found');
  }
  
  if (todo.userId !== userId) {
    throw new ApiError(403, 'Not authorized to update this todo');
  }

  return await todoRepository.updateTodo(todoId, data);
};

const deleteTodo = async (todoId, userId) => {
  const todo = await todoRepository.findTodoById(todoId);
  
  if (!todo) {
    throw new ApiError(404, 'Todo not found');
  }
  
  if (todo.userId !== userId) {
    throw new ApiError(403, 'Not authorized to delete this todo');
  }

  return await todoRepository.deleteTodo(todoId);
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
};`,

  'services/profile.service.js': `const bcrypt = require('bcrypt');
const authRepository = require('../repositories/auth.repository');
const ApiError = require('../../../handlers/apiError.handler');

const updateProfile = async (userId, data) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const updateData = { ...data };
  
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  
  if (data.email && data.email !== user.email) {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new ApiError(400, 'Email already in use');
    }
  }

  const updatedUser = await authRepository.updateUser(userId, updateData);
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

module.exports = {
  updateProfile
};`,

  // Controllers
  'controllers/todo.controller.js': `const asyncHandler = require('../../../handlers/async.handler');
const ApiResponse = require('../../../handlers/apiResponse.handler');
const todoService = require('../services/todo.service');

const createTodo = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const todo = await todoService.createTodo(userId, req.body);
  new ApiResponse(res, 201, 'Todo created successfully', todo);
});

const getTodos = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const todos = await todoService.getTodos(userId);
  new ApiResponse(res, 200, 'Todos retrieved successfully', todos);
});

const updateTodo = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const todoId = req.params.id;
  const todo = await todoService.updateTodo(todoId, userId, req.body);
  new ApiResponse(res, 200, 'Todo updated successfully', todo);
});

const deleteTodo = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const todoId = req.params.id;
  await todoService.deleteTodo(todoId, userId);
  new ApiResponse(res, 200, 'Todo deleted successfully', null);
});

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
};`,

  'controllers/profile.controller.js': `const asyncHandler = require('../../../handlers/async.handler');
const ApiResponse = require('../../../handlers/apiResponse.handler');
const profileService = require('../services/profile.service');

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const updatedProfile = await profileService.updateProfile(userId, req.body);
  new ApiResponse(res, 200, 'Profile updated successfully', updatedProfile);
});

module.exports = {
  updateProfile
};`,

  // Validations
  'validations/todo.validation.js': `const { z } = require('zod');

const createTodoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  status: z.enum(['pending', 'in progress', 'done', 'completed'])
});

const updateTodoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in progress', 'done', 'completed']).optional()
});

module.exports = {
  createTodoSchema,
  updateTodoSchema
};`,

  'validations/profile.validation.js': `const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

module.exports = {
  updateProfileSchema
};`,

  // Routes
  'routes/todo.route.js': `const { Router } = require('express');
const todoController = require('../controllers/todo.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');
const { validate } = require('../../../middlewares/validate.middleware');
const { createTodoSchema, updateTodoSchema } = require('../validations/todo.validation');

const router = Router();

router.use(authMiddleware); // Protect all todo routes

router.post('/', validate(createTodoSchema), todoController.createTodo);
router.get('/', todoController.getTodos);
router.patch('/:id', validate(updateTodoSchema), todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;`,

  'routes/profile.route.js': `const { Router } = require('express');
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');
const { validate } = require('../../../middlewares/validate.middleware');
const { updateProfileSchema } = require('../validations/profile.validation');

const router = Router();

router.use(authMiddleware); // Protect all profile routes

router.patch('/', validate(updateProfileSchema), profileController.updateProfile);

module.exports = router;`,

  'routes/index.js': `const { Router } = require('express');
const authRoutes = require('./auth.route');
const todoRoutes = require('./todo.route');
const profileRoutes = require('./profile.route');

const router = Router();

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/profile', profileRoutes);

module.exports = router;`,
};

try {
  // Create directories and files
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(apiV1Path, filePath);
    createDirectory(path.dirname(fullPath));
    createFile(fullPath, content);
  });

  console.log('API implementation generated successfully!');

  // Create Prisma schema additions
  const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  const todoModelSchema = `
model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      String
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Add to User model:
// todos Todo[]
`;

  if (fs.existsSync(prismaSchemaPath)) {
    fs.appendFileSync(prismaSchemaPath, todoModelSchema);
    console.log('Added Todo model to Prisma schema');
  }
} catch (error) {
  console.error('Error generating API:', error.message);
  process.exit(1);
}
