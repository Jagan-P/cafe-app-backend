const errorHandler = (err, req, res) => {
  if (!err || !err.code) {
    console.log("error", err.name, err.message, err.stack);
    return res.status(500).json({
      result: "Some error occured on our side.",
    });
  }
  if (err.code && err.result) {
    return res.status(err.code).json({
      result: err.result,
    });
  }
  console.log("error", err.name, err.message, err.stack);
  return res.status(500).json({
    result: "Some error occured on our side.",
  });
};

module.exports = {
  errorHandler,
};
