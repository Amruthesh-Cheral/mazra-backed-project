const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  }
},{timestamps:true});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;