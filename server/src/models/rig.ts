import { model, Schema } from 'mongoose';

export const RigSchema: Schema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    email: {
        type: String,
        default: ''
    },
    cards: {
        type: Number,
        default: 1
    },
    ip: {
        type: String,
        default: '',
        required: true,
    },
    wanIp: {
        type: String,
        default: ''
    },
    rigId: {
        type: String,
        default: '',
        //required: true,
    },
    osName: {
        type: String,
        default: '',
        //required: true,
    },
    appVersion: {
        type: String,
        default: ''
    },
    gpuModel: {
        type: String,
        default: ''
    },
    kernelName: {
        type: String,
        default: '',
        //required: true,
    },
    computerName: {
        type: String,
        default: 'A_New_Miner',
        required: true,
    },
    totalHashrate: {
        type: String,
        default: '',
        //required: true,
    },
    status: {
        type: String,
        default: '',
        //required: true,
    },
    singleHashrate: [Number],
    temperatures: [Number],
    fanSpeeds: [Number],
    core: [Number],
    memory: [Number],
    shares: {
        type: Number,
        default: 0
    },
    invalidShares: {
        type: Number,
        default: 0
    },
    rigUpTime: {
        type: Number
    },
    minerStartTime: {
        type: Date
    },
    serverTime: {
        type: Date
    },
    startTime: {
        type: Date
    },
    notes: {
        type: String
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'MinerGroup'
    },
    clocktone: {
        type: Schema.Types.ObjectId,
        ref: 'ProfileOption'
    }
});

// RigSchema.pre("save", function(next) {
//     if (!this.createdAt) {
//       this.createdAt = new Date();
//     }
//     next();
// });

export default model('Rig', RigSchema);