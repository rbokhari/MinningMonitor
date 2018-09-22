import { model, Schema } from 'mongoose';

export const MinerGroupSchema: Schema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String
    },
    notes: {
        type: String
    },
    minerClient: {
        type: Schema.Types.ObjectId, 
        ref: 'MinerClient'
    },
    configuration: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    }
});

export default model('MinerGroup', MinerGroupSchema);
