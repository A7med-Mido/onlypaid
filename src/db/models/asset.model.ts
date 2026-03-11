import { Schema, models, model, Model } from "mongoose";
import { AssetMongooseSchemaType } from "@/types";

const asset = new Schema<AssetMongooseSchemaType>({
  thumbnailImage: {
    type: String,
    required: true
  },
  assets: [
    {
      _id: {
        type: String,
        index: true
      },
      size: {
        type: Number,
        required: true
      },
      path: {
        type: String,
        required: true
      }
    }
  ],
  sellerId: {
    type: String,
    required: true,
    index: true
  },
  totalSize: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { 
  versionKey: false,
  timestamps: true,
});

const AssetModel: Model<AssetMongooseSchemaType> =
  (models.asset as Model<AssetMongooseSchemaType>) ||
  model<AssetMongooseSchemaType>("asset", asset);

export default AssetModel;