import { model, Schema } from 'mongoose';

export const PoolSchema: Schema = new Schema({
    name: {
        type: String
    },
    poolAddress: {
        type: String
    },
    notes: {
        type: String,
    },
    status: {
        type: Number
    }
});

export default model('Pool', PoolSchema);