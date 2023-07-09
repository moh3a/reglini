# REGLINI-DZ

## Todo

- add skeleton when loading ae data
- try refreshing ae access_token with [taobao.top.auth.token.refresh](https://open.taobao.com/api.htm?docId=25387&docType=2&scopeId=381)
- refactor and deal with performace and bad first time code!!!

## Issues

- Zapiex API product search route returns empty array for any query;
- Zapiex API routes requiring AE username and password, return the following error:

```json
{
  "statusCode": 400,
  "errorType": "Zapiex Custom Error",
  "errorMessage": "Unable to log in to this account. Please log in manually on a browser first.",
  "requestId": "<!-- requestId string -->"
}
```

- featured promo products (Aliexpress Affiliate API) are currently unavailable, receiving this response:

```json
{
  "error_response": {
    "code": 15,
    "msg": "Remote service error",
    "sub_code": "isp.featuredpromo-product-service-unavailable",
    "sub_msg": "主题推广活动商品获取服务不可用",
    "request_id": "<!-- requestId string -->"
  }
}
```

## Prerequisites

The machine that will run this app should have installed [node.js](https://nodejs.org/en/), [git](https://git-scm.com/downloads) and [postgres](https://www.postgresql.org/download/).

## Quickstart

- Clone the github repo by running the following command:
  - `git clone https://github.com/moh3a/reglini.git`
- To run the server for the first time:
  - `npm i`;
  - `npm run build`;
- Then start the production server:
  - `npm run start` for the local network;
- App uses Postgres by default, to change the datasource, go to `prisma/schema.prisma` and change the provider along with the URI in the .env file;
