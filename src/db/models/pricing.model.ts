import { Schema, models, model, Model } from "mongoose";
import { PricingMongooseSchemaType } from "@/types";

const price = new Schema<PricingMongooseSchemaType>({
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  offer: {
    type: Number,
    default: 0
  }
}, { 
  versionKey: false,
  timestamps: true,
});

const PricingModel: Model<PricingMongooseSchemaType> =
  (models.price as Model<PricingMongooseSchemaType>) ||
  model<PricingMongooseSchemaType>("price", price);

export default PricingModel;