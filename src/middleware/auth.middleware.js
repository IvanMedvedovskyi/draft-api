import jwt from "jsonwebtoken";

export function verifyAdminJWT(req, reply, done) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "No token provided" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    done();
  } catch (err) {
    reply.status(401).send({ error: "Invalid token" });
  }
}
