function checkRole(role){
    return function (req,res,next){
        if(req.session.loggedIn){
            if(req.session.userRole === role){
                next();
            } else {
                res.status(403).send('Erişim reddedildi. Yetkiniz yok.');
            } 
        } else {
            res.redirect('/api/auth/login');
        }
    };
};

module.exports = checkRole;