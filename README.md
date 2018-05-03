# Batch Service

This is simple service which allow to make batch request to an existing API. Application is on Express.js sever and have one endpoint to use (POST '/batch').
Batch system has simple retry mechanism. In case when server is unavailable it retry just one more time.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Requirements

* [NodeJs](http://nodejs.org)

### Install

```sh
$ git clone https://github.com/vvhistler/BatchService-.git
$ npm install
```

then

```sh
$ npm start
```

After that you can send requests [http://localhost:3000/batch](http://localhost:3000/batch)

### Usage
Request body contains three parts:
* urlTemplate - action url with template for query parameters
* verb - action method
* payload -  an array of objects, each of them containing a list of the needed parameters for action

Please take a look this example:

```
{
    "verb": "PUT",
    "uriTemplate": "https://guesty-user-service.herokuapp.com/user/{userId}",
    "payload": [{
            "queryParameters": {
                "userId": "1"
            },
            "body": {
                "age": 21
            }
        },
        {
            "queryParameters": {
                "userId": "2"
            },
            "body": {
                "age": 22
            }
        },
        {
            "queryParameters": {
                "userId": "3"
            },
            "body": {
                "name": "Jon Snow"
            }
        },
        {
            "queryParameters": {
                "userId": "4"
            },
            "body": {
                "age": 24
            }
        },
        {
            "queryParameters": {
                "userId": "5"
            },
            "body": {
                "name": "Jon Snow"
            }
        },
        {
            "queryParameters": {
                "userId": "6"
            },
            "body": {
                "age": 26
            }
        }
    ]
}
```

When you POST this body to http://localhost:3000/batch you should get result like:
```
{
    "results": [
        {
            "uri": "https://guesty-user-service.herokuapp.com/user/1",
            "status": 200
        },
        {
            "uri": "https://guesty-user-service.herokuapp.com/user/2",
            "status": 200
        },
        {
            "uri": "https://guesty-user-service.herokuapp.com/user/3",
            "status": 200
        },
        {
            "uri": "https://guesty-user-service.herokuapp.com/user/4",
            "status": 200
        },
        {
            "uri": "https://guesty-user-service.herokuapp.com/user/5",
            "status": 503
        },
        {
            "uri": "https://guesty-user-service.herokuapp.com/user/6",
            "status": 200
        }
    ],
    "statistics": {
        "totalCount": 6,
        "failed": 1,
        "succeed": 5
    }
}
```


## Authors

* **Vasyl Kobyletskyi**


