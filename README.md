# AI Proxy Message Viewer

A web application for viewing and filtering AI proxy messages from an Elasticsearch database.

## Features

- View user messages and AI responses from Elasticsearch
- Filter messages by username
- Pagination support for large datasets
- Clean, modern UI with expandable message cards
- Real-time connection to Elasticsearch

## Tech Stack

**Backend:**
- Node.js
- Express
- Elasticsearch client (@elastic/elasticsearch)

**Frontend:**
- React (with Vite)
- Axios for API calls
- Modern CSS styling

## Project Structure

```
Nexus/
├── backend/
│   ├── config/
│   │   └── elasticsearch.js    # Elasticsearch client configuration
│   ├── routes/
│   │   └── messages.js          # API routes for messages
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MessageCard.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── UserFilter.jsx
│   │   │   └── Pagination.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Elasticsearch instance running and accessible
- Data in the `ai-proxy-message` index

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   copy .env.example .env
   ```

4. Edit the `.env` file with your Elasticsearch credentials:
   ```env
   ES_NODE=http://localhost:9200
   ES_USERNAME=elastic
   ES_PASSWORD=your_password_here
   ES_INDEX=ai-proxy-message
   PORT=3001
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

### Running the Application

1. Make sure your Elasticsearch instance is running and accessible
2. Start the backend server (in the `backend` directory):
   ```bash
   npm run dev
   ```

3. In a new terminal, start the frontend (in the `frontend` directory):
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### GET `/api/messages`
Fetch messages with optional filtering and pagination.

**Query Parameters:**
- `username` (optional): Filter by specific user
- `page` (optional): Page number (default: 1)
- `size` (optional): Number of messages per page (default: 50)

**Response:**
```json
{
  "messages": [...],
  "total": 100,
  "page": 1,
  "size": 50,
  "totalPages": 2
}
```

### GET `/api/messages/users`
Get list of unique users with message counts.

**Response:**
```json
{
  "users": [
    {
      "username": "user1",
      "count": 45
    }
  ]
}
```

### GET `/api/messages/:id`
Get a specific message by ID.

**Response:**
```json
{
  "id": "...",
  "username": "...",
  "userQuestion": "...",
  "parsedResponse": "...",
  ...
}
```

## Elasticsearch Index Schema

The application expects documents in the `ai-proxy-message` index with the following fields:

- `username` - Username of the requester
- `userQuestion` - User's question/input
- `parsedResponse` - AI's parsed response
- `requestTime` - Timestamp of the request
- `requestId` - Unique request identifier
- `clientIp` - Client IP address
- `rawResponse` - Raw streaming response data

## Troubleshooting

### Backend won't connect to Elasticsearch

- Verify Elasticsearch is running: `curl http://localhost:9200`
- Check your credentials in the `.env` file
- Ensure the Elasticsearch node URL is correct
- Check if the index `ai-proxy-message` exists

### Frontend can't connect to backend

- Ensure the backend is running on port 3001
- Check browser console for CORS errors
- Verify the proxy configuration in `vite.config.js`

### No messages showing up

- Check if your Elasticsearch index has data
- Verify the index name matches in your `.env` file
- Check browser network tab for API errors
- Look at backend console logs for error messages

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## License

MIT
