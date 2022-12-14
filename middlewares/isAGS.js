export function isAGS(req, res, next) {
  try {
    if (req.currentUser.role !== "AGS") {
      return res.status(401).json({ msg: "User Unauthorized" });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
