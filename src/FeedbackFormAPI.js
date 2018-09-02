/**
 * POST feedback data to Zendesk
 * https://developer.zendesk.com/rest_api/docs/core/requests#create-request
 *
 * @param {Object} data      - Feedback data payload
 * @param {String} subdomain - Subdomain of zendesk account eg https://${subdomain}.zendesk.com
 *
 * @return {Object}          - Response from Zendesk
 *
 */
export const sendFeedback = async (data, subdomain) => {
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
 * @param {String} subject  - Zendesk ticket subject
 * @param {String} email    - Email provided by user giving feedback
 * @param {String} feedback - Feedback provided by user
 * @param {String} pageURL  - URL of page user submitted feedback from
 *
 * @return {Object}         - Payload for Zendesk Requests API
 *
 */
export const formatPayload = (
  subject,
  email,
  defaultName,
  feedback,
  pageURL
) => {
  const requester = email
    ? { name: defaultName, email }
    : { name: defaultName };

  const comment = pageURL
    ? {
        body: `${feedback}
${pageURL}`
      }
    : { body: feedback };

  return {
    request: {
      requester,
      subject,
      comment
    }
  };
};
