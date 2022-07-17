const handleAsyncError = (controller) => (req, res, next) => {
  controller(req, res)?.catch((e) => {
    next(e);
  });
};

module.exports = {
  handleAsyncError,
};
