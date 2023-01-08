import {
  ACCOUNT_TYPE,
  AUTH_PROVIDER,
  PAYMENT_METHOD,
  ROLES,
} from "@prisma/client";
import { MongoClient } from "mongodb";

import prisma from "../../config/prisma";
import { MDBUser } from "../types";

// Connection URL
const url =
  "mongodb+srv://moh3a:svESWHMzwUbLcxbN@reglini-db.jllwf.mongodb.net/reglini-db?retryWrites=true&w=majority";
const client = new MongoClient(url);

// Database Name
const dbName = "reglini-db";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("users");

  const users = await collection.find().toArray();
  for (let user of users as unknown as MDBUser[]) {
    try {
      await prisma.user.create({
        data: {
          account:
            user.account === "credentials"
              ? ACCOUNT_TYPE.CREDENTIALS
              : ACCOUNT_TYPE.OAUTH,
          provider:
            user.provider === "facebook"
              ? AUTH_PROVIDER.FACEBOOK
              : AUTH_PROVIDER.GOOGLE,
          email: user.email,
          password: user.password,
          name: user.name,
          resetPasswordExpire: user.resetPasswordExpire,
          resetPasswordToken: user.resetPasswordToken,
          role: user.role === "admin" ? ROLES.ADMIN : ROLES.BASIC,
          verified: user.verified,
          verifyCredentialsToken: user.verifyCredentialsToken,
          profile: {
            create: {
              phoneNumber: user.phoneNumber,
              picture: user.picture,
              realName: user.realName,
            },
          },
          address: {
            create: {
              commune: user.address?.commune,
              daira: user.address?.daira,
              postalCode: user.address?.postalCode,
              streetName: user.address?.streetName,
              wilaya: user.address?.wilaya,
            },
          },
        },
      });
      if (user.cart) {
        for (let cart of user.cart?.cartItems) {
          await prisma.cart.create({
            data: {
              user: {
                connect: {
                  email: user.email,
                },
              },
              productId: cart.productId,
              imageUrl: cart.imageUrl,
              name: cart.name,
              price: cart.price,
              carrierId: cart.carrierId,
              originalPrice: cart.originalPrice,
              quantity: cart.quantity,
              shippingPrice: cart.shippingPrice,
              sku: cart.sku,
              totalPrice: cart.totalPrice,
            },
          });
        }
      }
      if (user.wishlist) {
        for (let item of user.wishlist) {
          await prisma.wishlist.create({
            data: {
              id: item.productId,
              imageUrl: item.imageUrl,
              name: item.name,
              price: item.price,
              user: {
                connect: {
                  email: user.email,
                },
              },
            },
          });
        }
      }
      if (user.orders) {
        for (let order of user.orders) {
          await prisma.order.create({
            data: {
              id: order.orderId,
              currency: order.currency,
              details: JSON.stringify(order.details),
              payment: order.payment
                ? {
                    create: {
                      hasTimedOut: order.payment?.hasTimedOut,
                      isPaymentConfirmed: order.payment?.isPaymentConfirmed,
                      paymentMethod:
                        order.payment?.paymentMethod === "ccp"
                          ? PAYMENT_METHOD.CCP
                          : PAYMENT_METHOD.CIB,
                      receipt: order.payment?.receipt,
                      wasDeclined: order.payment?.wasDeclined,
                    },
                  }
                : undefined,
              user: {
                connect: {
                  email: user.email,
                },
              },
              product: {
                create: {
                  productId: order.product?.productId ?? "",
                  imageUrl: order.product?.imageUrl ?? "",
                  name: order.product?.name ?? "",
                  carrierId: order.product?.carrierId,
                  price: order.product?.price ?? 0,
                  orderMemo: order.product?.orderMemo,
                  quantity: order.product?.quantity,
                  shippingPrice: order.product?.shippingPrice,
                  totalPrice: order.product?.totalPrice,
                  sku: order.product?.sku,
                },
              },
              shippingAddress: order.shippingAddress
                ? {
                    create: {
                      city: order.shippingAddress.city ?? "",
                      countryCode: order.shippingAddress.countryCode ?? "",
                      mobilePhone: order.shippingAddress.mobilePhone ?? "",
                      name: order.shippingAddress.name ?? "",
                      addressLine1: order.shippingAddress.addressLine1 ?? "",
                      phoneCountry: order.shippingAddress.phoneCountry ?? "",
                      province: order.shippingAddress.province ?? "",
                      zipCode: order.shippingAddress.zipCode ?? "",
                    },
                  }
                : undefined,
              received: order.packageReceived
                ? {
                    create: {
                      packagePicture: order.packageReceived?.packagePicture,
                      wasReceived: order.packageReceived?.wasReceived,
                    },
                  }
                : undefined,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
