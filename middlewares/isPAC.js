export async function isPAC(req, res, next) {
  try {
    if (req.currentUser.role !== "PAC") {
      return res.status(401).json({ msg: "User Unauthorized" });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
