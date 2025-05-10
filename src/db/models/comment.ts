import { Schema, model, Types, Document } from 'mongoose';


export interface CommentDocument extends Document {
  text: string;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  authorId: Types.ObjectId;
  offerId: Types.ObjectId;
}


const commentSchema = new Schema<CommentDocument>({
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  offerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});


export const CommentModel = model<CommentDocument>('Comment', commentSchema);
