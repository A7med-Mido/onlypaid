import { Schema, models, model, Model } from "mongoose";
import { TransactionMongooseSchemaType } from "@/types";

const transaction = new Schema<TransactionMongooseSchemaType>({
  sellerId: {
    type: String,
    required: true,
    index: true
  },
  buyerId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  assetId: {
    type: String,
    required: true,
    index: true
  }
}, { 
  versionKey: false,
  timestamps: true,
});

const TransactionModel: Model<TransactionMongooseSchemaType> =
  (models.transaction as Model<TransactionMongooseSchemaType>) ||
  model<TransactionMongooseSchemaType>("transaction", transaction);

export default TransactionModel;