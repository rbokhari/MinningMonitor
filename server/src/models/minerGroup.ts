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
    wallet: {
        type: Schema.Types.ObjectId, 
        ref: 'Wallet'
    },
    pool: {
        type: Schema.Types.ObjectId, 
        ref: 'Pool'
    },
    clocktone: {
        type: Schema.Types.ObjectId, 
        ref: 'ProfileOption'
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
