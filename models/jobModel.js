const mongoose = require("mongoose");

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const jobSchema = new Schema(
    {
        jobTitle: {
            type: String,
            trim: true,
            require: true
        },
        Category: {
            type: String,
            trim: true,
            require: true
        },
        jobType:{
            type:String,
            trim:true,
            require:true
        },
        workPlacetype: {
            type: String,
            trim: true,
            require: true
        },
        salaryType: {
            type: String,
            trim: true,
        },
        amount: {
            type: Number,
            trim: true,
            require: true
        },
        duration: {
            type: String,
            trim: true,
        },
        decrption: {
            type: String,
        },
        id: {
            type: ObjectId,
            require: true
        },
        status: {
            type: String,
            require: true,
        },
        bid:[
            {
                bidValue:Number,
                userId:ObjectId,
                user:String
            }
        ],
        selected:[
            {
                amount:Number,
                userId:ObjectId
            }
        ]
    }, { timestamps: true }
);

const job = mongoose.model("job", jobSchema);
module.exports = job;