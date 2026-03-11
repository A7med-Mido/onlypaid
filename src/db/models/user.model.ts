import { Schema, models, model, Model } from "mongoose";
import { UserMongooseSchemaType } from "@/types";

const user = new Schema<UserMongooseSchemaType>({
  email: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    default: ""
  },
  assetsToSell: {
    type: [String],
    default: [],
    index: true
  },
  ownedAssets: {
    type: [String],
    default: [],
  },
}, { 
  versionKey: false,
  timestamps: true,
});

const UserModel: Model<UserMongooseSchemaType> =
  (models.user as Model<UserMongooseSchemaType>) ||
  model<UserMongooseSchemaType>('user', user);

export default UserModel;