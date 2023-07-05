# REGLINI-DZ

## Todo

- ae query -> experiencing multiple 500 status response from zapiex (called from the /search route), add aliexpress.ds.recommend.feed.get
- order status -> remove waiting payment if order details status is finished
- refactor and deal with performace and bad first time code!!!

## Issues

Zapiex API routes requiring AE username and password, return the following error:

```json
{
  "statusCode": 400,
  "errorType": "Zapiex Custom Error",
  "errorMessage": "Unable to log in to this account. Please log in manually on a browser first.",
  "requestId": "<!-- requestId string -->"
}
```

## Prerequisites

The machine that will run this app should have installed:

- Node.js [https://nodejs.org/en/]
- Git [https://git-scm.com/downloads]
- Postgres [https://www.postgresql.org/download/]

## Quickstart

- Clone the github repo by running the following command:
  - `git clone https://github.com/moh3a/reglini.git`
- To run the server for the first time:
  - `npm i`;
  - `npm run build`;
- Then start the production server:
  - `npm run start` for the local network;
- App uses Postgres by default, to change the datasource, go to `prisma/schema.prisma` and change the provider along with the URI in the .env file;
