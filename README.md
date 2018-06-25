# CCA Api #

Instore Messaging Portal.

## API References ##

## **USER**
___


|Description    |Method |URL    |Parameters   |Body |Header |
|---------------|-------|-------|-------------|-----|-------|
|Create user (only administrators users, or superior role, can create other users)  |POST   |http://localhost:1337/v1/user/signup   |   |email (required),<br/> password (required),<br/> confirmPassword (required)   |`Authorization bearer <token>` |

HTTP Response, success example:
```json
    {
        "response": {
            "message": "User created successfully",
            "data": {
                "user": {
                    "email": "admin@admin.com",
                    "createdAt": "2018-06-25T12:22:52.613Z",
                    "updatedAt": "2018-06-25T12:22:52.613Z",
                    "id": "5b30de9c12f8c159e2c17afe"
                },
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViMzBkZTljMTJmOGMxNTllMmMxN2FmZSIsImlhdCI6MTUyOTkyOTM3MiwiZXhwIjoxNTI5OTQwMTcyfQ.TWE4AYVsT8zTMr5Mn-YtBGyrg4Y-IHyd5T0g05MELGQ"
            }
        }
    }
```