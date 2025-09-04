const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "first name must be 3 character long"],
        },
        lastname: {
            type: String,
            minlength: [3, "first name must be 3 character long"],
        },
    },

    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5,"Email must be 5 characters long"], 
    },
    password: {
        type: String,
        required: true,
        select:false,
    },
    socketId: {
        type: String,
    },
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET,{expiresIn:'24h'})
    return token;
}
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}
userSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt); 
};

const userModel = mongoose.model('user',userSchema)

module.exports = userModel