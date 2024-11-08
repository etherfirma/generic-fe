# Auth operations

## Login

```angular2html
mutation ($email: String!, $password: String!) {
  res: loginPassword (email: $email, password: $password) {
    csrfToken
    user {
        id
        email
        name
    }
    token {
      version
      uid
      expires
      signature
      encoded
    }
  }
}

{
  "email" : "admin@etherfirma.com",
  "password" : "secret"
}

{
  "res": {
    "csrfToken": "nh0dVf5ZovKpQGteFPJLcA==",
    "user": {
      "id": "672cf2fbf2f99e1173805a02",
      "email": "admin@etherfirma.com",
      "name": "Etherfirma Administrator"
    },
    "token": {
      "version": 1,
      "uid": "672cf2fbf2f99e1173805a02",
      "expires": 1731013145657,
      "signature": "rwkT/rxYXckSohArIgwzig==",
      "encoded": "1:672cf2fbf2f99e1173805a02:1731013145657:rwkT/rxYXckSohArIgwzig=="
    }
  }
}
```

## Register

## Forgot Password

## Reset Password

## Verify Token

```angular2html
query ($token: String!) {
  verifyToken (token: $token) { 
    user {
        id
        email
        name
    }
    token {
      version
      uid
      expires
      signature
      encoded
    }
  }
}

{
  "token": "1:672cf2fbf2f99e1173805a02:1731013145657:rwkT/rxYXckSohArIgwzig=="
}

{
  "verifyToken": {
    "user": {
      "id": "672cf2fbf2f99e1173805a02",
      "email": "admin@etherfirma.com",
      "name": "Etherfirma Administrator"
    },
    "token": {
      "version": 1,
      "uid": "672cf2fbf2f99e1173805a02",
      "expires": 1731013145657,
      "signature": "rwkT/rxYXckSohArIgwzig==",
      "encoded": "1:672cf2fbf2f99e1173805a02:1731013145657:rwkT/rxYXckSohArIgwzig=="
    }
  }
}
```