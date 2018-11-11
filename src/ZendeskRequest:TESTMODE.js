// @flow
/*******************************************************************************
 * ZendeskRequest:TESTMODE
 *
 * This service mocks the behaviour of the Zendesk requests API.
 * This is useful for allowing developers to easily simulate the different
 * form states without having to submit data to Zendesk.
 *
 * Simon Schwartz
 ******************************************************************************/

import type {
  ZendeskRequestPayload,
  ZendeskRequestResponse,
  TestMode
} from "./_types";

/**
 * Simple logging wrapper for formatting browser console logs
 * log.info(), log.error(), log.success(), log.warning()
 *
 * @param {String} message   - Message to display in console
 * @param {Object} object    - Optional data to display
 * @param {string} colour    - Optional colour of the message
 *
 * @return {Function}        - console.log() with formatting
 *
 */
export const log = {
  styled: (message: string, object?: Object, color?: string = "black") =>
    console.log(
      `%cZendeskRequest:TESTMODE%c ${message}${object ? `\n` : ``}`,
      "color:DEEPSKYBLUE",
      `color:${color}`,
      object ? object : ""
    ),
  info: (message: string, object?: Object) => log.styled(message, object),
  error: (message: string, object?: Object) =>
    log.styled(message, object, "red"),
  success: (message: string, object?: Object) =>
    log.styled(message, object, "green"),
  warning: (message: string, object?: Object) =>
    log.styled(message, object, "darkkhaki")
};

/**
 * Mock the server side validation that the zendesk API does for requests
 *
 * @param {Object} payload - API POST request body
 *
 * @return {Object}        - Mock API response, or null for valid responses
 *
 */
const mockValidate = (payload: ZendeskRequestPayload) => {
  // Email regex pattern - if an ivalid email is entered, Zendesk API will return and error
  const regex = /^(?=(.{1,64}@.{1,255}))([!#$%&'*+\-\/=?\^_`{|}~a-zA-Z0-9}]{1,64}(\.[!#$%&'*+\-\/=?\^_`{|}~a-zA-Z0-9]{0,}){0,})@((\[(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}\])|([a-zA-Z0-9-]{1,63}(\.[a-zA-Z0-9-]{2,63}){1,}))$/; // eslint-disable-line

  // if email value is supplied, check it is valid
  let requester = null;
  if (
    payload.request.requester.email &&
    payload.request.requester.email.length &&
    !regex.test(payload.request.requester.email)
  ) {
    requester = [
      {
        description: `Requester: Email:  ${
          payload.request.requester.email
        } is not properly formatted`
      }
    ];
  }

  let base = null;
  // check comment is valid
  if (payload.request.comment.body.length < 1) {
    base = [
      {
        description: "Description: cannot be blank",
        error: "BlankValue",
        field_key: "description"
      }
    ];
  }

  if (!requester && !base) return null;

  // construct the Zendesk mock response based on the validation
  return {
    description: "Record validation errors",
    error: "RecordInvalid",
    details: {
      ...(requester ? { requester } : {}),
      ...(base ? { base } : {})
    }
  };
};

/**
 * Mock Zendesk API request responses to allow developers to test form functionality
 * without actually sending POST requests to the Zendesk API
 *
 * @param {Object} payload  - API POST request body
 * @param {Object} testMode - Test mode options
 *
 * @return {Promise}        - Resolve with mocked API response
 *
 */
export const mockRequest = (
  payload: ZendeskRequestPayload,
  testMode: TestMode
) => {
  const delay = testMode.delay || 1000;
  log.warning(`Sending payload.`, payload);

  // Determine mock validation errors response
  const validationErrors = mockValidate(payload);

  if (validationErrors) {
    return new Promise<ZendeskRequestResponse>(resolve => {
      setTimeout(() => {
        log.error(
          `Validation error - the data you provided was not valid.`,
          validationErrors
        );
        return resolve(validationErrors);
      }, delay);
    });
  }

  // if form payload data is valid, determine the simulated response to return
  const mockResponse =
    testMode.simulate === "success"
      ? {
          request: {
            id: 33,
            status: "new",
            description: payload.request.comment.body
          }
        }
      : {};

  return new Promise<ZendeskRequestResponse>(resolve => {
    setTimeout(() => {
      if (!mockResponse.request) {
        log.error(`Simulated a failure to post data to Zendesk.`);
      } else {
        log.success(`Successfully sent data to Zendesk.`, mockResponse);
      }

      return resolve(mockResponse);
    }, delay);
  });
};
