/* jslint node: true */
"use strict";

import "jest";
import { IAuthRequest, authParse, authEnforce } from "../../src/api/authMiddleware";
import express = require("express");
import { InvalidTokenError } from "../../src/api/InvalidTokenError";
import { UnauthorizedError } from "../../src/api/UnauthorizedError";

/**
 * Variables
 */

/* Attributes of the token:
 * user: admin
 * userid: 1
 * service: admin
 */
const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.\
eyJpc3MiOiJmdGFORTc0YUpSZm5WaU5sUHpKaEpQdjRGU05OcT\
EzQyIsImlhdCI6MTU2NjkyNDQ4NSwiZXhwIjoxNTY2OTI0OTA1\
LCJwcm9maWxlIjoiYWRtaW4iLCJncm91cHMiOlsxXSwidXNlcm\
lkIjoxLCJqdGkiOiIzNDkzN2E3OGJkNWIxNjdmMTg3ZTMyODZj\
NGE1N2YzOCIsInNlcnZpY2UiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4ifQ.\
U6IYw8Zpj2JOJ1g5mg-1wo2rzepfIwEqoCWs1BONngg";

// Mock functions
const mockConfig = {
  express: {
    next: jest.fn(),
    request: {
      header: jest.fn(),
    },
    response: jest.fn(() => ({
      get: jest.fn(),
      json: jest.fn(),
      status: jest.fn(),
      send: jest.fn(),
    })),
  },
};

/**
 * Mocks
 */
jest.doMock("express", () => ({
  express: mockConfig.express,
}));

/**
 * authMiddleware functions tests
 */
describe("authMiddleware", () => {
  let req: IAuthRequest;
  let res: express.Response;
  let spyHeader: jest.SpyInstance;
  let spyStatus: jest.SpyInstance;
  let spySend: jest.SpyInstance;

  beforeEach(() => {
    res = express.response;
    req = express.request;
    // To isolate tests from one another, we need to remove these parameters,
    // since they can be persisted between tests
    if (req.hasOwnProperty("user")) {
      delete req.user;
    }
    if (req.hasOwnProperty("userid")) {
      delete req.userid;
    }
    if (req.hasOwnProperty("service")) {
      delete req.service;
    }

    jest.resetAllMocks();
  });

  beforeAll(() => {
    spyHeader = jest.spyOn(express.request, "header");
    spyStatus = jest.spyOn(express.response, "status");
    spySend = jest.spyOn(express.response, "send");
  });

  /**
   * Function authParse tests
   */
  describe("authParse", () => {
    /**
     * Success tests
     */
    it("should parse", () => {
      spyHeader.mockReturnValueOnce(jwt);

      authParse(req, res, mockConfig.express.next);

      expect(req.user).toEqual("admin");
      expect(req.userid).toEqual(1);
      expect(req.service).toEqual("admin");

      expect(spyHeader).toHaveBeenCalled();
      expect(mockConfig.express.next).toHaveBeenCalled();
    });
  });
});
