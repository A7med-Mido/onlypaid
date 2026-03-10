import z from "zod";


const userSchema = z.object({
  _id: z.string(),
  name: z.string().min(2).max(30),
  email: z.email(),

})

const assetSchema = z.object({
  _id: z.string(),
  thumbnailImage: z.string(),
  assets: z.array(z.string()),
  sellerId: z.string()
})


const transSchema = z.object({
  _id: z.string(),
  sellerId: z.string(),
  buyerId: z.string(),
  amount: z.number(),
  assetId: z.string(),

})