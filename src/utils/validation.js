const validator = require("validator");
const axios = require("axios");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateEditProfile = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "skills",
    "photoUrl",
    "about",
    "gender",
    "age",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const getCommitCountForYearGraphQL = async (username, year) => {
  try {
    const token = process.env.YOUR_GITHUB_TOKEN;
    const headers = { Authorization: `Bearer ${token}` };
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
          }
        }
      }
    `;

    const variables = { username, from, to };

    const response = await axios.post(
      "https://api.github.com/graphql",
      { query, variables },
      { headers }
    );

    const totalCommits =
      response.data.data.user.contributionsCollection.totalCommitContributions;

    return totalCommits;
  } catch (error) {
    throw new Error("Error fetching GitHub commit data: " + error.message);
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfile,
  getCommitCountForYearGraphQL,
};
