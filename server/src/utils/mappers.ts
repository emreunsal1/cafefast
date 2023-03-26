export const mapUserForJWT = (userData) => ({
  email: userData.email,
  _id: userData._id,
});
