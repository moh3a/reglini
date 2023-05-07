# REGLINI-DZ

## Todo

- check all order api endpoints
- order create: error -> invalid signature || missing version
- refactor and deal with performace and bad first time code!!!

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
