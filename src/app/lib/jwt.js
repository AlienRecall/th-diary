import { SignJWT, jwtVerify } from "jose";

const secret = Buffer.from(process.env.jwt_secret_key);

export const createToken = async (username) => {
  const jwt = await new SignJWT({
    iss: "th-diary",
    sub: username,
    aud: "users",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 hour")
    .sign(secret);
  return jwt;
};

export const verifyToken = (token) => {
  try {
    const { payload } = jwtVerify(token, secret);

    console.log(payload);
    return payload;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};
