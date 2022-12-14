export function isMED(req, res, next) {
  try {
    if (req.currentUser.role !== "MED") {
      return res.status(401).json({ msg: "User Unauthorized" });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
