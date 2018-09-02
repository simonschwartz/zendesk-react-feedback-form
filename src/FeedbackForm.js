import React, { Component } from "react";
import PropTypes from "prop-types";
import { sendFeedback, formatPayload } from "./FeedbackFormAPI";

// The SuccessMessage replaces the form if the API succesfully returns
const SuccessMessage = () => <p>Thankyou for your feedback.</p>;

// The ErrorMessage is displayed at the top of the form if API returns error
const ErrorMessage = () => (
  <p className="error">Sorry, we could not process your feedback right now.</p>
);

class FeedbackForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      emailValue: "",
      emailError: "",
      feedbackValue: "",
      feedbackError: "",
      submitError: false,
      isLoading: false,
      isSubmitted: false
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ emailValue: event.target.value });
  }

  handleFeedbackChange(event) {
    this.setState({ feedbackValue: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ feedbackError: "", emailError: "", submitError: false });

    // Validate the email field
    // Email regex pattern - if an ivalid email is entered, Zendesk API will return and error
    const regex = /^(?=(.{1,64}@.{1,255}))([!#$%&'*+\-\/=?\^_`{|}~a-zA-Z0-9}]{1,64}(\.[!#$%&'*+\-\/=?\^_`{|}~a-zA-Z0-9]{0,}){0,})@((\[(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}\])|([a-zA-Z0-9-]{1,63}(\.[a-zA-Z0-9-]{2,63}){1,}))$/; // eslint-disable-line
    if (
      this.state.emailValue.length > 0 &&
      !regex.test(this.state.emailValue)
    ) {
      this.setState({ emailError: "Please enter a valid email" });
      return;
    }

    // Validate the feedback field
    if (this.state.feedbackValue.length === 0) {
      this.setState({ feedbackError: "Please add some feedback" });
      return;
    }

    // If fields are valid, set state to loading and make API POST request
    this.setState({ isLoading: true });
    const payload = formatPayload(
      this.props.feedbackSubject,
      this.state.emailValue,
      this.props.defaultUserName,
      this.state.feedbackValue,
      this.props.currentPageURL
    );
    const response = await sendFeedback(payload, this.props.subdomain);

    // If we dont get a success response, set submitError to true to show error message
    if (!response.request) {
      this.setState({ isLoading: false, submitError: true });
      return;
    }

    // If we get a success response, set isSubmitted to true to show the success message
    this.setState({ isLoading: false, isSubmitted: true });
  }

  render() {
    if (this.state.isSubmitted) {
      return (
        <div role="alert" aria-live="polite" aria-atomic="true">
          <SuccessMessage />
        </div>
      );
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <div role="alert" aria-live="polite" aria-atomic="true">
            {this.state.submitError && <ErrorMessage />}
          </div>
          <label htmlFor="feedback">Feedback (required)</label>
          <textarea
            id="feedback"
            name="feedback"
            rows="8"
            placeholder="Provide comments"
            value={this.state.feedbackValue}
            onChange={this.handleFeedbackChange}
            error={this.state.feedbackError}
          />
          <p className="error">{this.state.feedbackError}</p>
          <label htmlFor="email">Email (optional)</label>
          <input
            id="email"
            type="text"
            name="email"
            placeholder="example@email.com"
            value={this.state.emailValue}
            onChange={this.handleEmailChange}
          />
          <p className="error">{this.state.emailError}</p>
          <button type="submit">
            {this.state.isLoading ? "Submitting feedback" : "Submit"}
          </button>
        </form>
      );
    }
  }
}

FeedbackForm.defaultProps = {
  feedbackSubject: "Website Feedback",
  defaultUserName: "Anonymous user"
};

FeedbackForm.propTypes = {
  subdomain: PropTypes.string,
  feedbackSubject: PropTypes.string,
  defaultUserName: PropTypes.string,
  currentPageURL: PropTypes.string
};

export default FeedbackForm;
