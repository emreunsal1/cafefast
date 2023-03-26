export const mapUserForJWT = (userData) => ({
  _id: userData._id,
  email: userData.email,
  company: userData.company,
});
