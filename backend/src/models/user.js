import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  goal: {
    type: String,
    required: true, 
    enum: ["build muscle", "lose weight", "athletic performance", "general fitness"],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for user ID (this will be the _id field)
userSchema.virtual('userId').get(function() {
  return this._id;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password; // Don't send password in responses
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User; 