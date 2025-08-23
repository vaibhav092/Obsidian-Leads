# Lead Management System - Server

A comprehensive REST API for managing leads with advanced filtering and pagination capabilities.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete leads
- ✅ **Authentication**: JWT-based authentication
- ✅ **Pagination**: Server-side pagination with configurable limits
- ✅ **Advanced Filtering**: Multiple filter types with various operators
- ✅ **Data Validation**: Input validation and error handling
- ✅ **Database**: PostgreSQL with Prisma ORM

## API Endpoints

### Lead Management

| Method | Endpoint            | Description                                 |
| ------ | ------------------- | ------------------------------------------- |
| POST   | `/leads`            | Create a new lead                           |
| GET    | `/leads`            | Get all leads (with pagination & filtering) |
| GET    | `/leads/:id`        | Get a single lead by ID                     |
| PUT    | `/leads/:id`        | Update a lead                               |
| DELETE | `/leads/:id`        | Delete a lead                               |
| PATCH  | `/leads/:id/status` | Update lead status                          |
| PATCH  | `/leads/:id/score`  | Update lead score                           |

## Pagination

The `GET /leads` endpoint supports pagination with the following query parameters:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response Format:**

```json
{
    "success": true,
    "data": [
        /* leads array */
    ],
    "page": 2,
    "limit": 20,
    "total": 146,
    "totalPages": 8
}
```

## Filtering

The `GET /leads` endpoint supports advanced filtering with multiple operators. Filters are combined with AND logic.

### Filter Format

```javascript
GET /leads?fieldName={"operator":"operatorType","value":"filterValue"}
```

### Available Filters

#### String Fields (email, company, city)

- `equals`: Exact match
- `contains`: Case-insensitive substring match

**Examples:**

```javascript
// Exact email match
GET /leads?email={"operator":"equals","value":"john@example.com"}

// Company name contains "tech"
GET /leads?company={"operator":"contains","value":"tech"}
```

#### Enum Fields (status, source)

- `equals`: Exact match
- `in`: Match any value in array

**Examples:**

```javascript
// Status equals "qualified"
GET /leads?status={"operator":"equals","value":"qualified"}

// Status in multiple values
GET /leads?status={"operator":"in","value":["new","contacted"]}
```

#### Number Fields (score, leadValue)

- `equals`: Exact match
- `gt`: Greater than
- `lt`: Less than
- `between`: Range match

**Examples:**

```javascript
// Score greater than 50
GET /leads?score={"operator":"gt","value":50}

// Lead value between 1000 and 10000
GET /leads?leadValue={"operator":"between","value":[1000,10000]}
```

#### Date Fields (created_at, last_activity_at)

- `on`: Exact date match
- `before`: Before date
- `after`: After date
- `between`: Date range

**Examples:**

```javascript
// Created on specific date
GET /leads?created_at={"operator":"on","value":"2024-01-15"}

// Last activity between dates
GET /leads?last_activity_at={"operator":"between","value":["2024-01-01","2024-01-31"]}
```

#### Boolean Field (is_qualified)

- `equals`: Exact boolean match

**Example:**

```javascript
GET /leads?is_qualified={"operator":"equals","value":true}
```

### Multiple Filters

Combine multiple filters with AND logic:

```javascript
GET /leads?page=1&limit=10&status={"operator":"equals","value":"qualified"}&score={"operator":"gt","value":50}&company={"operator":"contains","value":"tech"}
```

## Setup

1. **Install Dependencies**

    ```bash
    npm install
    ```

2. **Environment Variables**
   Create a `.env` file with:

    ```
    DATABASE_URL="postgresql://username:password@localhost:5432/leadms"
    JWT_SECRET="your-secret-key"
    PORT=3000
    ```

3. **Database Setup**

    ```bash
    npx prisma generate
    npx prisma db push
    ```

4. **Start Server**
    ```bash
    npm start
    ```

## Testing

Use the provided test script to verify API functionality:

```bash
# Update the AUTH_TOKEN in test_api.js first
node test_api.js
```

## Data Model

### Lead Fields

- `id`: Unique identifier (CUID)
- `firstName`: First name (required)
- `lastName`: Last name (required)
- `email`: Email address (required, unique)
- `phone`: Phone number (optional)
- `company`: Company name (optional)
- `city`: City (optional)
- `state`: State (optional)
- `source`: Lead source (enum: website, facebook_ads, google_ads, referral, events, other)
- `status`: Lead status (enum: new, contacted, qualified, lost, won)
- `score`: Lead score 0-100 (default: 0)
- `leadValue`: Monetary value (optional)
- `lastActivityAt`: Last activity timestamp (optional)
- `isQualified`: Qualification status (default: false)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Error Handling

The API returns consistent error responses:

```json
{
    "success": false,
    "message": "Error description"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- Default pagination limit: 20 items per page
- Maximum pagination limit: 100 items per page
- No additional rate limiting implemented

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
