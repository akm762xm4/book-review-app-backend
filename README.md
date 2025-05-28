# Book Review App Backend

A RESTful API backend for a book review application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication and authorization
- Book management (CRUD operations)
- Review system for books
- Rating calculation and management
- Admin and user roles
- JWT-based authentication
- MongoDB database integration
- TypeScript support
- Error handling middleware
- Input validation

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator
- dotenv for environment variables
- Morgan for logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-review-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Build the TypeScript code:
```bash
npm run build
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create a new book (admin only)
- `PUT /api/books/:id` - Update a book (admin only)
- `DELETE /api/books/:id` - Delete a book (admin only)

### Reviews
- `POST /api/books/:id/reviews` - Add a review to a book (protected)
- `GET /api/books/:id/reviews` - Get all reviews for a book

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build TypeScript code
npm run build

# Start production server
npm start
```

## Deployment

This application is configured for deployment on Vercel. The `vercel.json` file includes the necessary configuration for the Node.js backend.

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

Make sure to set up the following environment variables in your Vercel project:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV`

## Error Handling

The application includes a global error handling middleware that processes all errors and returns appropriate HTTP status codes and error messages.

## Security

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Input validation using express-validator
- Protected routes using middleware
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/book-review-app](https://github.com/yourusername/book-review-app) 