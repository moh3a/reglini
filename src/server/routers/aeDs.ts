import { z } from "zod";

import { router, procedure } from "../trpc";
import { ZAE_ProductProperties } from "@reglini-types/zapiex";
import { AEProductPrice } from "@reglini-types/index";
import { get_product_price, parse_ae_properties } from "@utils/index";

export const aeDsRouter = router({
  product: procedure
    .input(z.object({ id: z.number(), locale: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      let properties: ZAE_ProductProperties[] = [];
      let price: AEProductPrice = {
        hasDiscount: false,
        discount: 0,
        discountedPrice: { min: 0, max: 0 },
        originalPrice: { min: 0, max: 0 },
      };
      const response = await ctx.aliexpress.ds.productDetails(
        input.id,
        input.locale ?? "FR"
      );

      if (response.result.currency_code.toUpperCase() !== "USD") {
        ctx.res.redirect(`/aliexpress/v1/product/${input.id}`);
        return;
      }

      if (response.result.aeop_ae_product_s_k_us) {
        // PROPERTIES
        response.result.aeop_ae_product_s_k_us.map((variations) => {
          if (variations.aeop_s_k_u_propertys) {
            variations.aeop_s_k_u_propertys?.map((props) => {
              parse_ae_properties(props, properties);
            });
          }
        });
      }

      // PRICE
      get_product_price(price, response.result.aeop_ae_product_s_k_us);

      return { result: response.result, properties, price };
    }),
  search: procedure
    .input(
      z.object({
        search: z.string(),
        locale: z.string().optional(),
        page_size: z.string().optional(),
        page_no: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.aliexpress.ds.searchProducts(
        input.search,
        input.locale ?? "FR",
        input.page_size,
        input.page_no
      );
      return response;
    }),
  shipping: procedure
    .input(z.object({ id: z.number(), quantity: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.aliexpress.ds.shipping(
        input.id,
        input.quantity ?? 1
      );
      return response;
    }),
  tracking: procedure
    .input(
      z.object({
        order_id: z.string(),
        tracking_id: z.string(),
        service_name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.aliexpress.ds.tracking(
        input.order_id,
        input.tracking_id,
        input.service_name
      );
      if (response.result_success) {
        return { success: true, result: response };
      } else return { success: false, error: response.error_desc };
    }),
});
