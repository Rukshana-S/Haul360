# Haul360 Backend

Production-ready Node.js, Express, TypeScript, and MongoDB backend for Haul360.

## Tech Stack

- **Node.js** & **Express**
- **TypeScript**
- **MongoDB Atlas** (Official MongoDB Node.js Driver)
- **Helmet** (Security Headers)
- **CORS** (Cross-Origin Resource Sharing)
- **Morgan** (HTTP Logging)
- **Dotenv** (Environment Configuration)
- **TSX** (Development Execution Engine)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and provide your MongoDB connection string:

```bash
cp .env.example .env
```

Set the following variables in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=haul360
```

### 3. Run in Development Mode

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Start Production Server

```bash
npm start
```

## API Health Check

Verify backend and database connection:

```http
GET /api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Haul360 API is running",
  "database": "connected"
}
```
