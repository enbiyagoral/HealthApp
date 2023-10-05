const {User} = require('../models/User');


async function checkEmail(email){
    const user = await User.findOne({email}).select("+password");

    if(user !==null){
        return {success:false, messages: 'Bu email kullanılmakta', login:true, user};
    }

    return {success:true, messages: 'Bu email kullanılmamakta', login:false};
}

module.exports = checkEmail;