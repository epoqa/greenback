const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

exports.generateAuthToken = async (param) => {
    const token = jwt.sign({ _id: param.toString() }, process.env.JWT_TOKEN, { expiresIn: '6h' });

    return token;    
}

exports.removeItemOnce = (arr, value) =>{
    let index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    refreshTokens = arr;
}