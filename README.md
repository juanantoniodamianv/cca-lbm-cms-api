# CCA Api #

Instore Messaging Portal.

## API References ##

## **USER**
___



|Description	|Method	|URL	|Parameters	|Body	|Header	|
|-------------|-------|-----|-----------|-----|-------|
|Create user (only administrators users, or superior role, can create other users)	|POST	|http://localhost:1337/v1/user/signup	|	|**email** (required), **password** (required), **confirmPassword** (required), firstName, lastName, userType, organization	|`Authorization bearer <token>`	|

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



|Description	|Method	|URL	|Parameters	|Body	|Header	|
|-------------|-------|-----|-----------|-----|-------|
|Sign In user account	|POST	|http://localhost:1337/v1/user/login	|	|**email** (required), **password** (required)	|	|

HTTP Response, success example:
```json
	{
		"response": {
			"message": "Successfully signed in",
			"data": {
				"user": {
					"email": "admin@admin.com",
					"createdAt": "2018-06-25T12:22:52.613Z",
					"updatedAt": "2018-06-25T12:22:52.613Z",
					"id": "5b30de9c12f8c159e2c17afe"
				},
				"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViMzBkZTljMTJmOGMxNTllMmMxN2FmZSIsImlhdCI6MTUyOTkyOTY2NSwiZXhwIjoxNTI5OTQwNDY1fQ.V2iWiAVIerebqLe2sce8kjveZRMHqPtdlVJagkJt6r4"
			}
		}
	}
```



|Description	|Method	|URL	|Parameters	|Body	|Header	|
|-------------|-------|-----|-----------|-----|-------|
|Show user account	|GET	|http://localhost:1337/v1/user/id	|	|	|	|

HTTP Response, success example:
```json
	{
		"email": "tonio@admin.com",
		"firstName": "Juan Antonio Damian",
		"lastName": "Vargas",
		"userType": "administrator",
		"organization": "Angus",
		"createdAt": "2018-06-26T13:05:51.017Z",
		"updatedAt": "2018-06-26T13:05:51.017Z",
		"id": "5b323a2f8035472511dd3234"
	}
```



|Description	|Method	|URL	|Parameters	|Body	|Header	|
|-------------|-------|-----|-----------|-----|-------|
|Show all user accounts	|GET	|http://localhost:1337/v1/user	|	|	|	|

HTTP Response, success example:
```json
	{
		"response": {
			"message": {
				"users": [
					{
						"email": "admin@admin.com",
						"firstName": "Admin",
						"lastName": "Admin Admin",
						"userType": "administrator",
						"organization": "Angus",
						"createdAt": "2018-06-26T13:05:33.724Z",
						"updatedAt": "2018-06-26T13:05:33.724Z",
						"id": "5b323a1d8035472511dd3233"
					},
					{
						"email": "tonio@admin.com",
						"firstName": "Juan Antonio Damian",
						"lastName": "Vargas",
						"userType": "administrator",
						"organization": "Angus",
						"createdAt": "2018-06-26T13:05:51.017Z",
						"updatedAt": "2018-06-26T13:05:51.017Z",
						"id": "5b323a2f8035472511dd3234"
					}
				]
			}
		}
	}
```



|Description	|Method	|URL	|Parameters	|Body	|Header	|
|-------------|-------|-----|-----------|-----|-------|
|Update user accounts	|PUT	|http://localhost:1337/v1/user/id	|	|password, confirmPassword (required if password exists), firstName, lastName, userType, organization		|`Authorization bearer <token>`	|

HTTP Response, success example: 

**Status 200 Ok**
```json
{
    "response": {
        "message": "User updated successfully",
        "data": {
            "user": [
                {
					...
                }
            ]
        }
    }
}
```



|Description	|Method	|URL	|Parameters	|Body	|Header	|
|-------------|-------|-----|-----------|-----|-------|
|Forgot password?	|POST	|http://localhost:1337/v1/forgot	|	|**email** (required)		|	|

HTTP Response, success example: 

**Status 200 Ok**
```json
	{
		"response": {
			"message": "The instruction to reset your password has been sent to your email."
		}
	}
```

**Status 401 Unauthorized**
```json
	{
		"response": {
			"message": "This email is not registered."
		}
	}
```



|Description	|Method	|URL	|Parameters	|Body	|Header	|
|-------------|-------|-----|-----------|-----|-------|
|Reset password	|POST	|http://localhost:1337/v1/reset	| token	|**password** (required), **confirmPassword** (required)		|	|

HTTP Response, success example: 

**Status 200 Ok**
```json
	{
		"response": {
			"message": "The instruction to reset your password has been sent to your email."
		}
	}
```

**Status 401 Unauthorized**
```json
	{
		"response": {
			"message": "The provided password token is invalid, expired, or has already been used."
		}
	}
```