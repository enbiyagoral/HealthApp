const jwt = require('jsonwebtoken');

function checkRole(role){
    return function (req,res,next){
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'Kimlik doğrulama hatası: JWT eksik.' });
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            req.user = decodedToken;
            if(req.user.loggedIn){
                if(req.user.userRole === role){
                    next();
                } else {
                    res.status(403).send('Erişim reddedildi. Yetkiniz yok.');
                } 
            } else {
                res.redirect('/api/auth/login');
            }
        } catch (error) {
            res.status(403).send('Erişim reddedildi. Yetkiniz yok.');
        }

       
    };
};

module.exports = checkRole;