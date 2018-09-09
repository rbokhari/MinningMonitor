import { model, Schema } from 'mongoose';

export const ActionSchema: Schema = new Schema({
    rig: {
        type: Schema.Types.ObjectId,
        ref: 'Rig'
    },
    action: {
        type: Number
    },
    status: {
        type: Number
    }
});

export default model('Action', ActionSchema);