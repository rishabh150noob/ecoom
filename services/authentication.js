const JWT = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET is not defined");
}

function createTokenForUser(user){

    const payload = {

        _id :user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role : user.role,
    };

    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token){
     const payload = JWT.verify(token,secret);
     return payload;
}

module.exports = {

    createTokenForUser,
    validateToken,
}

/*

User logs in
      ↓
createTokenForUser()
      ↓
payload created
      ↓
JWT.sign()
      ↓
token returned
      ↓
stored in cookier
      ↓
sent on future requests
      ↓
JWT.verify()
      ↓
req.user restored




You asked:

If JWT is created only after correct email and password, why do we need middleware to verify it again?

Short answer:
Because login happens only once, but authentication must be verified on every request.



*/