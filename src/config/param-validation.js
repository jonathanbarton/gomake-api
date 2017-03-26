import Joi from 'joi';

const flightName = Joi.string().regex(/^.*\-[1-9][0-9]{0,2}$/).required();
const userId = Joi.string().regex(/^\d{21,}$/).required();

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  telemetry: {
    params: {
      flightname: flightName
    }
  },

  flightInfo: {
    params: {
      flightname: flightName
    }
  },

  history: {
    params: {
      flightname: flightName
    }
  },

  userForFlight: {
    params: {
      flightname: flightName,
      userid: userId
    }
  }
};
