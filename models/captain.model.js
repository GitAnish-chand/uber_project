
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'firstname must be 3 character long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'lastname must be 3 character long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    socketId: {
        type: String
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'color must be 3 char long']

        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'plate must be 3 char long']

        },
        capacity: {
            type: Number,
            required: true,
            minlength: [3, 'capacity must be 1']

        },
        vehicleType: {
            type: String,
            required: true,
            // menum: ['CaretPosition', 'motorcycle', 'auto','car']
        }

    },
    location: {
        lat: {
            type:Number,
        }
    },

})

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id, email: this.email, status: this.status },
        process.env.JWT_SECRET ,
        { expiresIn: '7d' }
    );
    return token;
}
captainSchema.methods.comparePassword = async function(password) {
    // Assumes 'this.password' is the hashed password stored in the document
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function(plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
};

const captainModel =  mongoose.model('captian',captainSchema)

module.exports  = captainModel



