# Minimal URL Shortener App

A minimal React app to shorten URLs, view statistics, and test basic functionality. No fancy UI, just a working interface.

## Local Development Setup

This project is split into two parts:
- **Backend** (Node.js/Express): Handles URL shortening and statistics.
- **Frontend** (React): User interface for interacting with the backend.

### 1. Clone the repository
```sh
   git clone https://github.com/Joya-01/2218901.git
   cd 2218901
```

### 2. Start the Backend
```sh
cd "backend test submission"
npm install
npm start
```
The backend will run at [http://localhost:5000](http://localhost:5000)

### 3. Start the Frontend
```sh
cd "../frontend test submission"
npm install
npm start
```
The frontend will run at [http://localhost:3000](http://localhost:3000)

### 4. Environment Variables
Create a `.env` file in `frontend test submission/` with your API token:
```env
REACT_APP_ACCESS_TOKEN=your_token_here
```

### 5. Logging Middleware (Frontend)
The logging middleware is located at:

```
frontend test submission/src/utils/loggerMiddleware.js
```

This file exports a `logEvent` function for logging events to the API. It uses the `REACT_APP_ACCESS_TOKEN` environment variable for authentication.

## API Endpoints (Backend)

### Create Short URL
- **Method:** POST
- **Route:** `/shorturls`
- **Request Body:**
```json
{
  "url": "https://your-long-url.com",
  "validity": 30,
  "shortcode": "abcd1"
}
```
- **Response (201):**
```json
{
  "shortLink": "https://localhost:5000/abcd1",
  "expiry": "2025-01-01T00:30:00Z"
}
```

## Usage
- Enter a URL, validity (in minutes), and an optional shortcode in the form.
- Click "Shorten" to generate a short link.
- Results will appear in a table below the form.
- Visit the Stats page (`/stats`) to see a list of all shortened URLs.

## Testing
Run the test suite with:
```sh
npm test -- --watchAll=false
```
This will check that the Home and Stats pages render correctly.

## Error Handling
- User-friendly error messages are shown for invalid input or API/network failures.

---
