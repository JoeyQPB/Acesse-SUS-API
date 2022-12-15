export function isAGS(req, res, next) {
  if (req.currentUser.role !== "AGS") {
    return res.status(401).json({ msg: "User Unauthorized" });
  }
  next();
}
