const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.position) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(position => rolesArray.includes(position)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles