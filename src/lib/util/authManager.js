const ManagementClient = require("auth0").ManagementClient;
const {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
} = require("config");

// Queestion: The token returned expires, does it auto-renew?
const managementClient = new ManagementClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
});

function deleteUser(userId) {
  return managementClient.deleteUser({
    id: userId,
  });
}

module.exports = {
  deleteUser,
};
