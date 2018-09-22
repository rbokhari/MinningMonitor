import { model, Schema } from 'mongoose';

export const MinerClinetSchema: Schema = new Schema({
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
    isR: {
        type: Number
    },
    isRx: {
        type: Number
    },
    isNv: {
        type: Number
    },
    info: {
        type: String
    },
    remakrs: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    }
});

export default model('MinerClient', MinerClinetSchema);
