const AdminAuth = (req, res, next) => {
  //Actual logic for checking admin authorization
  console.log("Admin auth is getting checked!");
  const token = "xyz";
  const isAdminauthorized = token === "xyz";
  if (!isAdminauthorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

const UserAuth = (req, res, next) => {
  //Actual logic for checking user authorization
  console.log("User auth is getting checked!");
  const token = "xyzss";
  const isUserauthorized = token === "xyz";
  if (!isUserauthorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = {
  AdminAuth,
  UserAuth,
};
