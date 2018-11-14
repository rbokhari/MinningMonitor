import { model, Schema } from 'mongoose';

export const ActionSchema: Schema = new Schema({
    // rig: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Rig'
    // },
    rig: {
        type: String
    },
    action: {
        type: Number
    },
    status: {
        type: Number
    }
});

// ActionSchema.virtual('rig', {
//     ref: 'Rig',
//     localField: 'rig',
//     foreignField: 'rigId',
//     justOne: true // for many-to-1 relationships
// });

export default model('Action', ActionSchema);