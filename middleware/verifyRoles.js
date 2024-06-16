const verifyRoles = (...allowedRoles)=>{
    return (req, res, next) =>{
        if(!req?.roles) return res.sendStatus(400);
        const roles = [...allowedRoles]; 
        const allowed = req.roles.map(role => roles.includes(role)).find(value => value===true);
        if(!allowed) return res.sendStatus(401); 
        next(); 
    };
}; 
module.exports = verifyRoles; 