// @flow
/*******************************************************************************
 * ZendeskRequest
 *
 * This component:
 *  - handles the functions for submitting form data to Zendesk API
 *  - manages the loading, error and success state of the API requests
 *  - passes the above submit function and state to children via render props
 *
 * Simon Schwartz
 ******************************************************************************/

import React from "react";
import { sendFeedback, formatPayload } from "./ZendeskRequest:API";
import { mockRequest, log } from "./ZendeskRequest:TESTMODE";
import type {
  ZendeskSubmitData,
  ZendeskRequestPayload,
  TestMode
} from "./_types";

type ZendeskError = {
  /* Human readable description of error */
  description?: string,
  /* Error ID */
  error?: string,
  /* Additional detailed information of validation errors */
  details?: Object
};

type State = {
  /* Is the form submission currently processing? */
  isLoading: boolean,
  /* Has the form successful submitted? */
  isSubmitted: boolean,
  /* Has the most recent form submission request failed? */
  hasError: boolean,
  /* Error response from Zendesk API */
  error: ZendeskError
};

// The data passed as Render props from ZendeskRequest
export type ZendeskRenderProps = {
  /* Function for submitting data to Zendesk */
  handleSubmit: Function,
  ...$Exact<State>
};

type ZendeskRequestProps = {
  /* Zendesk account domain eg https://{subdomain}.zendesk.com/ */
  subdomain: string,
  /* Function that renders react components with access to the form state */
  render: (
    formProps: ZendeskRenderProps
  ) => React$Node | Array<React$Node> | null,
  /* Function to call before submitting the form - commonly used for form validation */
  preSubmit?: Function,
  /* Function to call after form has successfuly submitted */
  postSubmit?: Function,
  /* Enable test mode to stub out the Zendesk API for testing purposes */
  TESTMODE?: TestMode
};

class ZendeskRequest extends React.Component<ZendeskRequestProps, State> {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    isLoading: false,
    isSubmitted: false,
    hasError: false,
    error: {}
  };

  componentDidMount() {
    if (this.props.TESTMODE) {
      log.info(
        `ZendeskRequest is in test mode. Currently stubbing out all Zendesk API requests.`
      );
      log.info(
        `Disable test mode by removing TESTMODE prop from ZendeskRequest component.`
      );
    }
  }

  async handleSubmit(options: ZendeskSubmitData, event: SyntheticEvent<any>) {
    const { comment, email, subject, name } = options;
    event.preventDefault();

    // If preSubmit prop is provided - call the preSubmit function
    // This will commonly be validation on the feedback form created by user
    if (this.props.preSubmit) this.props.preSubmit();

    this.setState({ isLoading: true, hasError: false, error: {} });

    // Format the options into format required by Zendesk API
    const payload = formatPayload({
      subject,
      email,
      comment,
      name
    });

    // POST payload to Zendesk (or mock it if we are in TEST MODE)
    const response = this.props.TESTMODE
      ? await mockRequest((payload: ZendeskRequestPayload), this.props.TESTMODE)
      : await sendFeedback(
          (payload: ZendeskRequestPayload),
          (this.props.subdomain: string)
        );

    // If we dont get a success response, set hasError to true and pass error response
    if (!response.request) {
      this.setState({
        isLoading: false,
        hasError: true,
        error: response.error
          ? response
          : {
              description: `Failed to POST Zendesk request`
            }
      });
      return;
    }

    // If we get a success response, set isSubmitted to true
    this.setState({ isLoading: false, isSubmitted: true }, () => {
      // If postSubmit prop is provided - call the postSubmit function with API response
      if (this.props.postSubmit) this.props.postSubmit(response);
    });
  }

  render() {
    return this.props.render({
      handleSubmit: this.handleSubmit,
      ...this.state
    });
  }
}

export default ZendeskRequest;
