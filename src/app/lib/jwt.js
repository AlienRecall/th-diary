import { SignJWT, jwtVerify } from "jose";

const secret = Buffer.from(process.env.jwt_secret_key);

export const createToken = async (user_id, username) => {
  const jwt = await new SignJWT({
    iss: "th-diary",
    sub: username,
    aud: "users",
    id: user_id,
  })
    .setIssuedAt()
    .setExpirationTime("1 hour")
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);

  var now = new Date();
  now.setTime(now.getTime() + 1 * 3600 * 1000);
  return { token: jwt, expires: now.toUTCString() };
};

export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);

    console.log(payload);
    return payload;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};
