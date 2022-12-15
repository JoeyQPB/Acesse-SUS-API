export function isMED(req, res, next) {
  if (req.currentUser.role !== "MED") {
    return res.status(401).json({ msg: "User Unauthorized" });
  }
  next();
}
