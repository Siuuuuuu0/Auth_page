const {ATTEMPT_LIMIT, LOCK_DURATION} = require('../config/rateLimiter');
const lockAccount =async(user)=>{
    user.failedAttempts++;
    switch(user.failedAttempts) {
        case ATTEMPT_LIMIT : user.lockedUntil = Date.now() + LOCK_DURATION; break;
        case ATTEMPT_LIMIT * 2  : user.lockedUntil = Date.now() + LOCK_DURATION *4; break;
        case ATTEMPT_LIMIT * 3 : user.lockedUntil = Date.now() + LOCK_DURATION * 16; break;
        case ATTEMPT_LIMIT * 4 : user.lockedUntil = undefined; user.indefiniteLock = true; user.failedAttempts = 0; break;
        default : ;
    }
    await user.save();
}; 
module.exports = lockAccount;