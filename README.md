# deel-assesment

## Prerequisite
- Ensure you have node and npm installed on your machine.  If you’re not sure kindly enter this command on your terminal:
    `node -v`
    `npm -v`


- Clone this project to your machine:
    `git clone xxxxx`


- Open the project on your favourite IDE . I recommend VScode [Guess Is because I love it 😍]
- To test the routes, you’ll need API client like  Postman and if you’re team Insomnia, thats fine.

## Installing 

Enter the root directory of this project  and enter the command below to install all dependencies.

`npm install`

After installing all dependencies, check if the app is up and running by entering on the command below:

`npm run start`

The command should spin up the app, you can see the port  the app is running on your terminal.
### Test if routes are working:

    GET http://localhost:3001




## APIS

All endpoints must have profile_id passed to the **HEADERS** to authenticate except admin's endpoints



Download postman collection here [Deel assesment postman collection](https://drive.google.com/file/d/1AAfc1YWcyHuMekzeQZKsEKfYSG1-ioWt/view?usp=sharing).
### BASEURL: 
`http://localhost:3001/api/v1`


### ***GET*** `/contracts/:id
#### Headers:
`profile_id`: `xxxx`
#### Description
`id`: integer

**Sample response:**

```javascript
    {
    "status": "success",
    "message": "Contract successfully fetched",
    "data": {
        "id": 1,
        "terms": "bla bla bla",
        "status": "terminated",
        "createdAt": "2022-07-14T13:23:30.855Z",
        "updatedAt": "2022-07-14T13:23:30.855Z",
        "ContractorId": 5,
        "ClientId": 1,
        "Client": {
            "firstName": "Harry",
            "lastName": "Potter"
        },
        "Contractor": {
            "firstName": "John",
            "lastName": "Lenon"
        }
    }
}
```

 ### ***GET***  `/contracts`

**Sample response:**

```javascript
{
    "status": "success",
    "message": "Contract(s) successfully fetched",
    "data": [
        {
            "id": 2,
            "terms": "bla bla bla",
            "status": "in_progress",
            "createdAt": "2022-07-14T13:23:30.855Z",
            "updatedAt": "2022-07-14T13:23:30.855Z",
            "ContractorId": 6,
            "ClientId": 1,
            "Client": {
                "firstName": "Harry",
                "lastName": "Potter"
            },
            "Contractor": {
                "firstName": "Linus",
                "lastName": "Torvalds"
            }
        }
    ]
}

```

### ***GET*** `/jobs/unpaid`
#### Headers:
`profile_id`: `xxxx`


**Sample response:**

```javascript
{
    "status": "success",
    "message": "Upaid jobs successfully fetched",
    "data": [
        {
            "id": 2,
            "description": "work",
            "price": 201,
            "paid": null,
            "paymentDate": null,
            "createdAt": "2022-07-14T13:23:30.855Z",
            "updatedAt": "2022-07-14T13:23:30.855Z",
            "ContractId": 2,
            "Contract": {
                "id": 2,
                "terms": "bla bla bla",
                "status": "in_progress",
                "createdAt": "2022-07-14T13:23:30.855Z",
                "updatedAt": "2022-07-14T13:23:30.855Z",
                "ContractorId": 6,
                "ClientId": 1
            }
        }
    ]
}
```

 ### ***POST*** `/jobs/:job_id/pay`
 #### Headers:
`profile_id`: `xxxx`

#### Payload

```javascript
{
    "amount":xxx
}
```

 #### Description
`job_id`: integer
`amount` : Number (Int or float)

**Sample response:**

```javascript
{
    "status": "success",
    "message": "Payment successful",
    "data": {
        "id": 1,
        "firstName": "Harry",
        "lastName": "Potter",
        "profession": "Wizard",
        "balance": 7910.94,
        "type": "client",
        "createdAt": "2022-07-14T13:23:30.854Z",
        "updatedAt": "2022-07-18T10:16:50.066Z"
    }
}

```

### ***POST*** `/balances/deposit/:userId`
 #### Headers:
`profile_id`: `xxxx`

 #### Description
 `userId`: Int

 **Sample response:**

 ```javascript
 {
    "status": "success",
    "message": "Deposit successful",
    "data": {
        "id": 1,
        "firstName": "Harry",
        "lastName": "Potter",
        "profession": "Wizard",
        "balance": 7800,
        "type": "client",
        "createdAt": "2022-07-14T13:23:30.854Z",
        "updatedAt": "2022-07-18T09:36:30.607Z"
    }
}
 ```

### ***GET*** `/admin/best-profession?start=<date>&end=<date>`

#### Headers:
`admin_id`: `90901`

 #### Description
 
 `start`: Date (YYYY-MM-DD)

 `end`: Date (YYYY-MM-DD)

   **Sample response:**

   ```javascript
   {
    "status": "success",
    "message": "best professions successfully fetched",
    "data": [
        {
            "profession": "Programmer",
            "total_amount_earned": 2683
        },
        {
            "profession": "Musician",
            "total_amount_earned": 221
        },
        {
            "profession": "Fighter",
            "total_amount_earned": 200
        }
    ]
}
   ```

### ***GET*** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` 

#### Headers:
`admin_id`: `90901`

 ### Description

 `start`: Date (YYYY-MM-DD)

 `end`: Date (YYYY-MM-DD)

 `limit`: Int (Defaults to 2 when not passed)

**Sample response:**

```javascript
{
    "status": "success",
    "message": "best clients successfully fetched",
    "data": [
        {
            "id": 1,
            "fullname": "Harry, Potter",
            "paid": "442"
        },
        {
            "id": 2,
            "fullname": "Mr, Robot",
            "paid": "442"
        }
    ]
}
```


### To run tests:
`npm run test`
