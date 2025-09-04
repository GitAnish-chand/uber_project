## Users API — Register

Documented for the Express backend in `Backend/`.

### Base URL
`/users`

### Endpoints
- **POST** `/users/register`
- **GET** `/users/profile`
- **GET** `/users/logout`

## POST /users/register

### Description
Create a new user account. On success, returns a JWT auth token and the created user object.

### Headers
- **Content-Type**: `application/json`

### Request Body
Provide a JSON object with the following shape:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Validation Rules
- **email**: must be a valid email address.
- **fullname.firstname**: minimum length 5 characters (validated in route).
- **password**: minimum length 6 characters.

Note: The model also enforces additional constraints (e.g., unique email, minimums). Violations may surface as errors.

### Responses
- **201 Created**
  - Body:
  ```json
  {
    "token": "<jwt-token>",
    "user": {
      "_id": "<mongo-id>",
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john.doe@example.com"
      // other non-selected fields (like password) are omitted
    }
  }
  ```

- **400 Bad Request** (validation error)
  - Body (example):
  ```json
  {
    "errors": [
      {
        "type": "field",
        "msg": "invalid Email",
        "path": "email",
        "location": "body"
      }
    ]
  }
  ```

- **500 Internal Server Error**
  - Unhandled errors (e.g., database issues, duplicate email not explicitly caught) will return a server error.

### Example cURL
```bash
curl -X POST "http://localhost:3000/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {"firstname": "John", "lastname": "Doe"},
    "email": "john.doe@example.com",
    "password": "secret123"
  }'
```

### Implementation References
- Route: `Backend/routes/user.route.js` (`POST /register` under `/users` base)
- Controller: `Backend/controllers/user.controller.js`
- Service: `Backend/services/user.service.js`
- Model: `Backend/models/user.model.js`

## GET /users/profile

### Description
Retrieve the authenticated user's profile information. Requires a valid JWT token for authentication.

### Headers
- **Authorization**: `Bearer <jwt-token>` (required)
- **Cookie**: `token=<jwt-token>` (alternative to Authorization header)

### Authentication
This endpoint requires authentication via JWT token. The token can be provided either:
- In the `Authorization` header as `Bearer <token>`
- As a cookie named `token`

### Responses
- **200 OK**
  - Body:
  ```json
  {
    "_id": "<mongo-id>",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com"
    // other user fields (password is omitted)
  }
  ```

- **401 Unauthorized**
  - Body:
  ```json
  {
    "messages": "Unauthorized"
  }
  ```
  - Occurs when no token is provided

- **401 Unauthorized** (Blacklisted token)
  - Body:
  ```json
  {
    "message": "Unauthorized blacklist"
  }
  ```
  - Occurs when the token has been blacklisted (user logged out)

- **401 Unauthorized** (Invalid token)
  - Body:
  ```json
  {
    "messages": "Unauthorized User"
  }
  ```
  - Occurs when the token is invalid or expired

### Example cURL
```bash
curl -X GET "http://localhost:3000/users/profile" \
  -H "Authorization: Bearer <jwt-token>"
```

## GET /users/logout

### Description
Log out the authenticated user by blacklisting their JWT token. The token will be invalidated and cannot be used for future requests.

### Headers
- **Authorization**: `Bearer <jwt-token>` (required)
- **Cookie**: `token=<jwt-token>` (alternative to Authorization header)

### Authentication
This endpoint requires authentication via JWT token. The token can be provided either:
- In the `Authorization` header as `Bearer <token>`
- As a cookie named `token`

### Responses
- **200 OK**
  - Body:
  ```json
  {
    "messges": "Logged out"
  }
  ```
  - The token is blacklisted and the cookie is cleared

- **401 Unauthorized**
  - Body:
  ```json
  {
    "messages": "Unauthorized"
  }
  ```
  - Occurs when no token is provided

- **401 Unauthorized** (Blacklisted token)
  - Body:
  ```json
  {
    "message": "Unauthorized blacklist"
  }
  ```
  - Occurs when the token has already been blacklisted

- **401 Unauthorized** (Invalid token)
  - Body:
  ```json
  {
    "messages": "Unauthorized User"
  }
  ```
  - Occurs when the token is invalid or expired

### Example cURL
```bash
curl -X GET "http://localhost:3000/users/logout" \
  -H "Authorization: Bearer <jwt-token>"
```

### Implementation References
- Route: `Backend/routes/user.route.js` (`GET /profile` and `GET /logout` under `/users` base)
- Controller: `Backend/controllers/user.controller.js`
- Middleware: `Backend/middlewares/auth.middleware.js`
- Model: `Backend/models/blackListToken.model.js`

---

## Captains API — Register

Documented for the Express backend in `Backend/`.

### Base URL
`/captains`

### Endpoints
- **POST** `/captains/register`

## POST /captains/register

### Description
Create a new captain account. On success, returns a JWT auth token and the created captain object with vehicle information.

### Headers
- **Content-Type**: `application/json`

### Request Body
Provide a JSON object with the following shape:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123",
  "vehicle": {
    "color": "Blue",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "Sedan"
  }
}
```

### Validation Rules
- **fullname.firstname**: required, must be a string, minimum length 3 characters
- **fullname.lastname**: required, must be a string, minimum length 3 characters
- **email**: required, must be a valid email address
- **password**: required, minimum length 6 characters
- **vehicle.color**: required, must be a string, minimum length 3 characters
- **vehicle.plate**: required, minimum length 3 characters
- **vehicle.capacity**: required, must be an integer, minimum value 1
- **vehicle.vehicleType**: required, must be a string

### Responses
- **201 Created**
  - Body:
  ```json
  {
    "token": "<jwt-token>",
    "captain": {
      "_id": "<mongo-id>",
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john.doe@example.com",
      "vehicle": {
        "color": "Blue",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "Sedan"
      }
      // other non-selected fields (like password) are omitted
    }
  }
  ```

- **400 Bad Request** (validation error)
  - Body (example):
  ```json
  {
    "errors": [
      {
        "type": "field",
        "msg": "Firstname must be at least 3 characters long",
        "path": "fullname.firstname",
        "location": "body"
      }
    ]
  }
  ```

- **400 Bad Request** (duplicate email)
  - Body:
  ```json
  {
    "message": "captain already exist"
  }
  ```

- **500 Internal Server Error**
  - Unhandled errors (e.g., database issues) will return a server error.

### Example cURL
```bash
curl -X POST "http://localhost:3000/captains/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {"firstname": "John", "lastname": "Doe"},
    "email": "john.doe@example.com",
    "password": "secret123",
    "vehicle": {
      "color": "Blue",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "Sedan"
    }
  }'
```

### Implementation References
- Route: `Backend/routes/captain.routes.js` (`POST /register` under `/captains` base)
- Controller: `Backend/controllers/captain.controller.js`
- Service: `Backend/services/captain.service.js`
- Model: `Backend/models/captain.model.js`


