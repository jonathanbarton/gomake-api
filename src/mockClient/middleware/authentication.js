function authentication(req, res, done) {
  if (req.session.token) {
    done();
  } else {
    res.json('Unauthorised');
  }
}

export default authentication;
