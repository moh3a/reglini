# REGLINI-DZ

## Quickstart

- Clone the github repo by running the following [git](https://git-scm.com/downloads) command:
  - `git clone https://github.com/moh3a/reglini.git`
- To run the server for the first time, you should have [Node.js](https://nodejs.org/en/) installed and then run:
  - `npm i`;
  - `npm run build`;
- Then start the production server:
  - `npm run start` for the local network;
- App uses [Postgres](https://www.postgresql.org/download/) by default, to change the datasource, go to `prisma/schema.prisma` and change the provider along with the URI in the .env file;

## Issues

### AE Dropshipping API

- after a few failed Aliexpress DS API calls, i get this error

```json
{
  "error_response": {
    "code": 7,
    "msg": "App Call Limited",
    "sub_code": "accesscontrol.limited-by-dynamic-access-count",
    "sub_msg": "This ban will last for <!-- countdown --> more seconds",
    "request_id": "<!-- requestId string -->"
  }
}
```

it may be due flow control error [search for `App Call Limited` in this doc](https://developer.alibaba.com/docs/doc.htm?treeId=285&articleId=109122&docType=1)

### AE Affiliate API

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

### ZAPIEX

- ALMOST ALL ZAPIEX SERVICES ARE DOWN !!!
- Zapiex API routes requiring AE username and password, return the following error:

```json
{
  "statusCode": 400,
  "errorType": "Zapiex Custom Error",
  "errorMessage": "Unable to log in to this account. Please log in manually on a browser first.",
  "requestId": "<!-- requestId string -->"
}
```
