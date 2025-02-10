
const roleMidelware = (req, res, next) => {

    try {
        const role = req.user.role;

        if(role != 'ADMIN')
            return res.status(401).json({ "error": "Unauthorized" });
        next();
    } catch(error) {
        return res.status(500).json({"error": "An error occures"});
    }
}

module.exports = roleMidelware;