const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
   category: {
  type: String,
  required: true,
  enum: ["Laptop", "TV", "Desktop", "AC", "Accessories"]
}
,
    images: [
      {
        public_id: String,
        url: String
      }
    ],
    specs: {
      type: Object,
      default: {}
    },
    isAccessory: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
