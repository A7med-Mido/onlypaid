import z from "zod";

const userSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.email(),
  ownedAssets: z.array(z.string())
});

const assetSchema = z.object({
  thumbnailImage: z.string(),
  asset: z.string(),
  sellerId: z.string(),
  size: z.number(),
  price: z.number(),
  description: z.string(),
  name: z.string()
});

const transSchema = z.object({
  sellerId: z.string(),
  buyerId: z.string(),
  amount: z.number(),
  assetId: z.string(),
});

const pricingSchema = z.object({
  price: z.number(),
  size: z.string(),
  description: z.string(),
  offer: z.number(),
});

export type UserZodSchemaType = z.infer<typeof userSchema>;
export type AssetZodSchemaType = z.infer<typeof assetSchema>;
export type TransactionZodSchemaType = z.infer<typeof transSchema>;
export type PricingZodSchemaType = z.infer<typeof pricingSchema>;