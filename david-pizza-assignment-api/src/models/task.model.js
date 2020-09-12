import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dateFrom: {type: Date, required: true},
    dateTo: {type: Date, required: true},
    workedHours: {type: Number, required: true},
    userEmail: {type: String, ref: 'users'}
}, {timestamps: true});

export default mongoose.model('tasks', taskSchema);
