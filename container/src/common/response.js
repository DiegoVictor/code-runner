const OK = (body = null) => {
  const response = {
    statusCode: 200,
  };

  if (body) {
    response.body = JSON.stringify(body);
  }

  return response;
};

const BAD_REQUEST = (body) => {
  return {
    statusCode: 400,
    body: JSON.stringify(body),
  };
};

module.exports.HTTP = {
  OK,
  BAD_REQUEST,
};
