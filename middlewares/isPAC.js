export function isPAC(req, res, next) {
  if (req.currentUser.role !== "PAC") {
    return res.status(401).json({ msg: "User Unauthorized" });
  }

  next();
}
