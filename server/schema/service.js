class ServiceSuccess {
  constructor(data = null, message = null) {
    this.status_code = 200;
    this.is_success = true;
    this.data = data;
    this.error = null;
    this.message = message;
    this.system_message = message;
  }
}

class ServiceError {
  constructor(message = "Something went wrong") {
    this.status_code = 500;
    this.is_success = false;
    this.data = null;
    this.error = "Internal server error";
    this.message = message;
    this.system_message = message;
  }
}

/**
  @param data - Custom data response
  @param message - Custom message response
  @returns 200 Success
*/
function success(data, message) {
  const res = new ServiceSuccess(data, message);
  return res;
}

/**
  @param code - Custom code response
  @param message - Custom message response
  @returns custom code
*/
function customCode(code = 204, message = "No Content : Success but got something incorrect", isSuccess = false) {
  const res = new ServiceSuccess(message);
  res.is_success = isSuccess;
  res.status_code = code;
  return res;
}

/**
  @param message - Custom message response
  @returns 400 Bad Request error
*/
function badRequest(message = "Bad Request") {
  const err = new ServiceError(message);
  err.status_code = 400;
  err.error = "Bad Request";
  console.log(err);
  return err;
}

/**
  @param message - Custom message response
  @returns 422 Unprocessable Entity error
*/
function badData(message = "Unprocessable Entity") {
  const err = new ServiceError(message);
  err.status_code = 422;
  err.error = "Unprocessable Entity";
  console.log(err);
  return err;
}

/**
  @param message - Custom message response
  @returns 500 Internal Server error
*/
function badImplementation(message = "Internal Server Error") {
  const err = new ServiceError(message);
  err.status_code = 500;
  err.error = "Internal Server Error";
  console.log(err);
  return err;
}

module.exports = {
  success,
  customCode,
};
