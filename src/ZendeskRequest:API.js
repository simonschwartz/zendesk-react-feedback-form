// @flow
/*******************************************************************************
 * ZendeskRequest:API
 *
 * This service provides functions required for making API requests to
 * the Zendesk API.
 *
 * Simon Schwartz
 ******************************************************************************/

import type { ZendeskRequestPayload, ZendeskSubmitData } from "./_types";

/**
 * POST request data to Zendesk
 * https://developer.zendesk.com/rest_api/docs/core/requests#create-request
 *
 * @param {Object} data      - Request data payload
 * @param {String} subdomain - Subdomain of zendesk account eg https://${subdomain}.zendesk.com
 *
 * @return {Object}          - Response from Zendesk
 *
 */
export const sendFeedback = async (
  data: ZendeskRequestPayload,
  subdomain: string
) => {
  try {
    const headers = {
      "Content-Type": "application/json"
    };
    const response = await fetch(
      `https://${subdomain}.zendesk.com/api/v2/requests.json`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return error;
  }
};

/**
 * Format a payload of form data to the format required by Zendesk
 *
 * @param {String} subject   - Zendesk ticket subject
 * @param {String} name      - Name of the person submitting ticket
 * @param {String} email     - Email provided by user giving feedback
 * @param {String} comment   - Comment provided by user
 *
 * @return {Object}          - Payload for Zendesk Requests API
 *
 */
export const formatPayload = ({
  subject,
  email,
  name,
  comment
}: ZendeskSubmitData): ZendeskRequestPayload => {
  return {
    request: {
      requester: {
        name: name ? name : "Annonymous user",
        ...(email ? { email } : {})
      },
      subject: subject ? subject : "Zendesk React form",
      comment: { body: comment }
    }
  };
};
