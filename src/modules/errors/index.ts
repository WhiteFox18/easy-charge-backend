import CustomError from "./CustomError";

const Errors = {
  login: () => {
    throw new CustomError({
      statusCode: 401,
      message: "login",
      description: "username or password incorrect",
      fields: []
    })
  },
  notExists: (fields: string[]) => {
    throw new CustomError({
      statusCode: 404,
      message: "notExists",
      description: "item not exists",
      fields: fields
    })
  },
  unexpectedServerError: () => {
    throw new CustomError({
      statusCode: 500,
      message: "unexpectedServerError",
      description: "unexpected server error occurred",
      fields: []
    })
  },
  alreadyExists: (fields: string[]) => {
    throw new CustomError({
      statusCode: 400,
      message: "alreadyExists",
      description: "item already exists",
      fields: fields
    })
  },
  notAuthenticated: () => {
    throw new CustomError({
      statusCode: 401,
      message: "notAuthenticated",
      description: "you are not authenticated",
      fields: []
    })
  },
  fuelTypeHasParent: () => {
    throw new CustomError({
      statusCode: 400,
      message: "fuelTypeHasParent",
      description: "given parent id already has parent",
      fields: ["parent_id"]
    })
  },
  notAllowed: () => {
    throw new CustomError({
      statusCode: 406,
      message: "notAllowed",
      description: "you do not have enough permissions",
      fields: []
    })
  }
}

export default Errors