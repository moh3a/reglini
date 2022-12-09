/**
 * UNCOMMENT EVERYTHING FOR THIS TO WORK
 */

import prisma from "../../config/prisma";
// import Wilayas from "../../data/Wilayas";

export interface Commune {
  post: string;
  zip_code: string;
  commune_id?: string;
  commune?: string;
  code_ons?: string;
  daira?: string;
  wilaya: string;
  wilaya_id: number;
  wilaya_zip_code: string;
}

// const parsed_data = Wilayas.map((wilaya) => {
//   let d: Commune[][] = [];
//   const communes: Commune[] | undefined = wilaya.dairas
//     ?.map((daira, daira_index) => {
//       return daira.communes
//         ?.map((commune, commune_index) => {
//           const post = {
//             post: commune.name,
//             commune_id:
//               wilaya.id +
//               "" +
//               daira_index +
//               "" +
//               commune_index +
//               "" +
//               commune.postalCode,
//             commune: commune.name,
//             zip_code: commune.postalCode,
//             code_ons: commune.codeONS,
//             daira: daira.name,
//             wilaya: wilaya.name,
//             wilaya_id: wilaya.id,
//             wilaya_zip_code: wilaya.postalCode,
//           };
//           const otherPosts = commune.otherPosts?.map((post) => {
//             return {
//               post: post.name,
//               zip_code: post.postalCode,
//               commune_id:
//                 wilaya.id +
//                 "" +
//                 daira_index +
//                 "" +
//                 commune_index +
//                 "" +
//                 commune.postalCode,
//               commune: commune.name,
//               code_ons: commune.codeONS,
//               daira: daira.name,
//               wilaya: wilaya.name,
//               wilaya_id: wilaya.id,
//               wilaya_zip_code: wilaya.postalCode,
//             };
//           });
//           if (otherPosts && otherPosts.length > 0) return [post, ...otherPosts];
//           else return [post];
//         })
//         .flat();
//     })
//     .flat();
//   if (communes && communes.length > 0) d.push(communes);

//   const cities = wilaya.address?.map((city) => {
//     return {
//       post: city.name,
//       zip_code: city.postalCode,
//       wilaya: wilaya.name,
//       wilaya_id: wilaya.id,
//       wilaya_zip_code: wilaya.postalCode,
//     };
//   });
//   if (cities && cities.length > 0) d.push(cities);

//   return d.flat();
// }).flat();

const insertable_data = (commune: Commune) => {
  return {
    commune:
      commune.commune_id && commune.commune
        ? {
            connectOrCreate: {
              where: {
                id: commune.commune_id,
              },
              create: {
                id: commune.commune_id,
                name: commune.commune,
                code_ons: commune.code_ons,
                daira: commune.daira
                  ? {
                      connectOrCreate: {
                        where: {
                          name: commune.daira,
                        },
                        create: {
                          name: commune.daira,
                          wilaya: {
                            connectOrCreate: {
                              where: {
                                id: commune.wilaya_id,
                              },
                              create: {
                                id: commune.wilaya_id,
                                name: commune.wilaya,
                                zip_code: commune.wilaya_zip_code,
                              },
                            },
                          },
                        },
                      },
                    }
                  : undefined,
              },
            },
          }
        : undefined,
    post: commune.post,
    zip_code: commune.zip_code,
    wilaya: {
      connectOrCreate: {
        where: {
          id: commune.wilaya_id,
        },
        create: {
          id: commune.wilaya_id,
          name: commune.wilaya,
          zip_code: commune.wilaya_zip_code,
        },
      },
    },
  };
};

const insert = async (data: Commune[]) => {
  for (let commune of data) {
    if (commune.zip_code && commune.wilaya_id) {
      try {
        await prisma.post.create({
          data: insertable_data(commune),
        });
      } catch (e: any) {
        if (e.meta.target[0] === "code_ons") {
          delete commune[e.meta.target[0] as keyof typeof commune];
          await prisma.post.create({
            data: insertable_data(commune),
          });
        }
      }
    }
  }
};

// insert(parsed_data);
