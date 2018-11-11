// @flow

/**
 * We allow users to pass config options to define a test mode environment.
 * The test mode simulates the Zendesk API to allow testing without actually
 * sending real POST requests or requiring a Zendesk account.
 *
 */
export type TestMode = {
  /* Type of Zendesk API response to simulate */
  simulate: "success" | "failure",
  /* Response time of the Zendesk mock API response */
  delay?: number
};

/**
 * Form data passed to ZendeskRequest handleSubmit() function
 *
 */
export type ZendeskSubmitData = {
  /* Main body of text to be sent with request - eg feedback, query, request information */
  comment: string,
  /* Subject of the request */
  subject?: string,
  /* The users email address, can be used to reply to their request in Zendesk */
  email?: string,
  /* The users name */
  name?: string
};

/**
 * Zendesk Request Payload
 * The formatted payload to be sent in Zendesk requests POST
 * https://developer.zendesk.com/rest_api/docs/core/requests#create-request
 *
 */
type Comment = {
  body: string
};

type Requester = {
  name: string,
  email?: string
};

type Request = {
  requester: Requester,
  subject: string,
  comment: Comment
};

// The correctly formatted payload for Zendesk request POST body
export type ZendeskRequestPayload = {
  request: Request
};

/**
 * Zendesk Request response
 * The response from Zendesk API create-request POST
 * https://developer.zendesk.com/rest_api/docs/core/requests#create-request
 *
 */
type RequestResponse = {
  id: number,
  status: string,
  description: string
};

export type ZendeskRequestResponse = {
  /* Success response object */
  request?: RequestResponse,
  /* Human readable description of error */
  description?: string,
  /* Error ID */
  error?: string,
  /* Additional detailed information of validation errors */
  details?: Object
};
