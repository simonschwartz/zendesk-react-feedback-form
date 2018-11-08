// @flow
import React from "react";
import { sendFeedback, formatPayload } from "./API";
import { fakeRequest } from "./utils"

type RenderProps = {
  handleSubmit: Function,
  isLoading: boolean,
  isSubmitted: boolean,
  hasError: boolean
};

type Props = {
  subdomain: string,
  render: (formState: RenderProps) => React$Node | Array<React$Node> | null,
  stubAPI?: "success" | "failure",
  postSubmit: Function,
  preSubmit: Function
};

type State = {
  isLoading: boolean,
  isSubmitted: boolean,
  hasError: boolean
};

type Payload = {
  feedback: string,
  email?: string,
  subject?: string,
  name?: string
};



class ZendeskFeedback extends React.Component<Props, State> {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    isLoading: false,
    isSubmitted: false,
    hasError: false
  };

  async handleSubmit(options: Payload, event: SyntheticEvent<any>) {
    const { feedback, email, subject, name } = options;
    event.preventDefault();

    // If preSubmit prop is provided - call the preSubmit function
    // This will commonly be validation on the feedback form created by user
    if (this.props.preSubmit) this.props.preSubmit();

    this.setState({ isLoading: true, hasError: false });

    const payload = formatPayload({
      subject,
      email,
      feedback,
      name
    });
    console.log(payload);
    const response = this.props.stubAPI
      ? await fakeRequest(this.props.stubAPI === "success" ? true : false)
      : await sendFeedback(payload, this.props.subdomain);

    // If we dont get a success response, set hasError to true
    if (!response.request) {
      this.setState({ isLoading: false, hasError: true });
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

export default ZendeskFeedback;
