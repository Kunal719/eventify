import mongoose, { Document, models } from 'mongoose';

export interface ICategory extends Document {
    _id: string
    name: string
}

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const Category = models.Category || mongoose.model('Category', CategorySchema);

export default Category;