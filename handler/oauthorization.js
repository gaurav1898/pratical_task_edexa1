const tokenServe = require('./genToken');
module.exports = function permits(...roles){


    // const isAllowed = role => roles.indexOf(role) >-1;

    return async (req, res, next) => {
        const reqRole = roles;
        const finalToken = (req.headers.authorization || req.headers.Authorization || '').split('JWT ').pop();
        const reqToken = finalToken.replace('"','');        // console.log(reqRole);
        console.log(reqToken);

        /*  
         * If token not exist Unauthorized error
         */
        if(!reqToken){
            // const error = new Error('Token Not Exists');
            // error.status = 401;
            // return next(error);
            console.log('Token not exists')
            return next(
                    res.status(401).json({
                    status: false,
                    message :"Unauthorized access"
                })
            );
        }

        try{
            const decodeToken = await tokenServe.verifyToken(reqToken);
            req.tokenData = decodeToken;
            const userRoles = decodeToken.data.roles;
            console.log(userRoles)
            /* !!!: 
                validating the routing permission with user permission
                if user have the permission is will show the permission  
            */
            const intersection = reqRole.filter(element => userRoles.includes(element));

            if(intersection>-1){
                // console.log('UnOauthorized user to access the page')
                return next(
                    res.json({
                        message : "You don't have permission, Please contact your administrator."
                    })
                );
            }
            next();
        }catch(err){
            next(err);
        }
        
    };
}