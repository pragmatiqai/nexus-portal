# Nexus Portal - AI Compliance Platform

A comprehensive web application for monitoring, analyzing, and managing AI conversations with advanced risk assessment and compliance tracking. Built by PragmatiqAI to ensure your AI systems meet regulatory requirements and organizational policies.

![PragmatiqAI](frontend/public/pragmatiq-logo.png)

## Features

### 🔐 Authentication
- Secure login system with email and password
- Session management
- User profile display

### 📊 Dashboard
- Total conversations and messages statistics
- 30-day activity metrics
- Critical and high-risk issue tracking
- Real-time data visualization

### 💬 Conversation Management
- View and filter AI conversations by user
- Risk-based filtering (Critical, High, Medium, Low)
- Detailed conversation timeline view
- Message-by-message analysis

### ⚠️ Risk Assessment
- Automated risk level detection
- Integration with n8n workflow automation
- Risk categorization (Critical, High, Medium, Low)
- Compliance violation tracking

### 🔄 Data Synchronization
- Real-time sync with Elasticsearch
- Conversation grouping and indexing
- Automated risk assessment updates

### 🎨 Modern UI/UX
- PragmatiqAI branded design
- Responsive layout
- Inter font family
- Clean, professional interface

## Tech Stack

**Backend:**
- Node.js with Express
- Elasticsearch client (@elastic/elasticsearch)
- RESTful API architecture
- Docker support

**Frontend:**
- React 18 with Vite
- Axios for API communication
- CSS Variables for theming
- Nginx for production serving

**Infrastructure:**
- Docker & Docker Compose
- Multi-stage builds for optimization
- Health checks and auto-restart
- Alpine Linux base images

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/pragmatiqai/nexus-portal.git
   cd nexus-portal
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Elasticsearch credentials:
   ```env
   ES_NODE=http://your-elasticsearch-host:9200
   ES_INDEX=ai-proxy-message
   ES_API_KEY=your-api-key
   PORT=3001
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

See [DOCKER.md](DOCKER.md) for detailed Docker deployment instructions.

### Manual Setup

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Elasticsearch instance with API key authentication

#### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your configuration:
   ```env
   ES_NODE=http://your-elasticsearch-host:9200
   ES_INDEX=ai-proxy-message
   ES_API_KEY=your-api-key
   PORT=3001
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Access at http://localhost:3000

## Project Structure

```
nexus-portal/
├── backend/
│   ├── config/
│   │   └── elasticsearch.js       # Elasticsearch client
│   ├── routes/
│   │   ├── messages.js             # Message & conversation routes
│   │   └── sync.js                 # Sync operations
│   ├── services/
│   │   └── conversationSync.js     # Conversation grouping logic
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── pragmatiq-logo.png      # PragmatiqAI logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx       # Dashboard with statistics
│   │   │   ├── Login.jsx           # Authentication page
│   │   │   ├── ConversationList.jsx
│   │   │   ├── ConversationDetail.jsx
│   │   │   ├── ConversationCard.jsx
│   │   │   ├── UserFilter.jsx
│   │   │   ├── RiskFilter.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── SyncButton.jsx
│   │   ├── App.jsx
│   │   └── index.css               # CSS variables & theming
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
├── DOCKER.md
└── README.md
```

## API Endpoints

### Authentication
The application currently uses client-side authentication. Backend integration can be added as needed.

### Dashboard
- **GET** `/api/messages/dashboard/stats`
  - Returns: Total conversations, messages, 30-day metrics, critical/high risk counts

### Conversations
- **GET** `/api/messages/conversations`
  - Query params: `username`, `page`, `size`
  - Returns: Paginated conversation list with risk assessments

- **GET** `/api/messages/conversations/:conversationId`
  - Returns: All messages in a conversation

- **POST** `/api/messages/conversations/:conversationId/risk-assessment`
  - Body: Risk assessment data
  - Updates conversation risk level

### Messages
- **GET** `/api/messages`
  - Query params: `username`, `page`, `size`
  - Returns: Paginated message list

- **GET** `/api/messages/users`
  - Returns: List of unique users with message counts

### Sync Operations
- **POST** `/api/sync/sync`
  - Triggers conversation sync and grouping
  - Creates/updates conversations index

## Elasticsearch Indices

### ai-proxy-message (Source Index)
Contains raw AI proxy messages with fields:
- `username` - User identifier
- `userQuestion` - User's query
- `parsedResponse` - AI response
- `rawResponse` - Raw streaming data with conversation_id
- `requestTime` - Timestamp
- `requestId` - Unique request ID
- `clientIp` - Client IP address
- `model` - AI model used

### ai-proxy-conversations (Derived Index)
Contains grouped conversations with risk assessments:
- `conversationId` - Unique conversation identifier
- `username` - User identifier
- `firstQuestion` - Initial question
- `lastQuestion` - Most recent question
- `messageCount` - Number of messages
- `firstMessageTime` - Start timestamp
- `lastMessageTime` - End timestamp
- `model` - AI model used
- `clientIp` - Client IP
- `riskAssessment` - Risk analysis object
  - `overall_risk_level` - CRITICAL, HIGH, MEDIUM, LOW
  - `risk_factors` - Array of identified risks
  - `compliance_violations` - Array of violations
  - `recommendations` - Array of recommendations

## Configuration

### Environment Variables

**Backend (.env):**
```env
ES_NODE=http://elasticsearch-host:9200
ES_INDEX=ai-proxy-message
ES_API_KEY=your-elasticsearch-api-key
PORT=3001
NODE_ENV=production
```

### Login Credentials

Default authentication is handled client-side. Configure users in `frontend/src/components/Login.jsx`:

```javascript
// Update credentials as needed
if (email === 'your-email@domain.com' && password === 'your-password') {
  onLogin({ email, name: 'User Name' });
}
```

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Docker Deployment

See [DOCKER.md](DOCKER.md) for comprehensive Docker deployment guide including:
- Production configuration
- Resource limits
- HTTPS setup
- Troubleshooting
- Backup strategies

## Troubleshooting

### Elasticsearch Connection Issues
1. Verify Elasticsearch is accessible
2. Check API key is valid
3. Ensure index exists: `curl -H "Authorization: ApiKey YOUR_KEY" http://es-host:9200/ai-proxy-message`

### Frontend Cannot Reach Backend
1. Check backend is running: `curl http://localhost:3001/health`
2. Verify CORS configuration
3. Check proxy settings in vite.config.js or nginx.conf

### No Data Showing
1. Run sync operation: `POST http://localhost:3001/api/sync/sync`
2. Check Elasticsearch has data
3. Verify index names match in .env

### Docker Issues
1. Check logs: `docker-compose logs -f`
2. Verify .env file is configured
3. Ensure ports are not in use
4. Restart services: `docker-compose restart`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues, questions, or feature requests:
- GitHub Issues: https://github.com/pragmatiqai/nexus-portal/issues
- Email: andres.gavriljuk@pragmatiqai.com

## License

MIT License - See LICENSE file for details

---

Built with ❤️ by [PragmatiqAI](https://pragmatiqai.com)
