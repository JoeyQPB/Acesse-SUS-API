export function isROOT(req, res, next) {
  if (req.currentUser.role !== "ROOT") {
    return res.status(401).json({ msg: "User Unauthorized" });
  }

  next();
}
