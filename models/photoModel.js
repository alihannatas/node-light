import mongoose, { Schema } from "mongoose";

const photoSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  adress:{
    type:String,
    required: true,
    
  },
  photo_id: {
    type: String,
  }
});

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;
