function ensurePermissionToLikePost(req, res, next) {
  if (!res.locals.isAuthenticated) {
    return res.redirect("/auth/google");
  }
  return next();
}

module.exports = ensurePermissionToLikePost;
