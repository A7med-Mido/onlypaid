import { Schema, models, model, Model } from "mongoose";
import { CollectionAssetMongooseSchemaType } from "@/types";

const collection = new Schema<CollectionAssetMongooseSchemaType>({
  thumbnailImage: {
    type: String,
    required: true
  },
  assets: [{
    type: String,
    required: true,
    trim: true
  }],
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  sellerId: {
    type: String,
    required: true,
    index: true
  },
  size: {
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

const CollectionAssetModel: Model<CollectionAssetMongooseSchemaType> =
  (models.collection as Model<CollectionAssetMongooseSchemaType>) ||
  model<CollectionAssetMongooseSchemaType>("collection", collection);

export default CollectionAssetModel;