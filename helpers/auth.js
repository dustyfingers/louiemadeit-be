// import libs/other
const bcryptjs = require('bcryptjs');

module.exports = {
    saltAndHashPw: pw => {
        const salt = bcryptjs.genSaltSync(10);
        return bcryptjs.hashSync(pw, salt);
    },
    checkPw: (givenPw, storedHash) => bcryptjs.compareSync(givenPw, storedHash),
};
