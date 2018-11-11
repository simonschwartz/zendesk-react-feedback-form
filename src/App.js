// @flow
import React, { Component } from "react";
import ZendeskRequest from "./ZendeskRequest";
import type { ZendeskRenderProps } from "./ZendeskRequest";
import type { ZendeskSubmitData } from "./_types";

type State = {
  feedbackValue: string,
  emailValue: string,
  nameValue: string,
  subjectValue: string
};

type Props = {};

class App extends Component<Props, State> {
  state = {
    feedbackValue: "",
    emailValue: "",
    nameValue: "",
    subjectValue: ""
  };

  handleValidate = this.handleValidate.bind(this);
  doStuff = this.doStuff.bind(this);
  handleChange = this.handleChange.bind(this);

  handleValidate() {
    // validate the form
  }

  doStuff(response: any) {
    // post submit hook
  }

  handleChange(event: SyntheticInputEvent<*>) {
    this.setState({ [`${event.target.name}Value`]: event.target.value });
  }

  render() {
    return (
      <ZendeskRequest
        subdomain="acme-inc"
        preSubmit={this.handleValidate}
        postSubmit={this.doStuff}
        TESTMODE={{ simulate: "success", delay: 1000 }}
        render={({
          handleSubmit,
          isLoading,
          isSubmitted,
          hasError,
          error
        }: ZendeskRenderProps) => {
          return (
            <form
              onSubmit={e =>
                handleSubmit(
                  ({
                    comment: this.state.feedbackValue,
                    email: this.state.emailValue,
                    subject: this.state.subjectValue,
                    name: this.state.nameValue
                  }: ZendeskSubmitData),
                  e
                )
              }
            >
              {error.error && <p>{error.description}</p>}
              {isLoading && <p>LOADING</p>}
              {isSubmitted && <p>SUCCESS</p>}
              {!isSubmitted && (
                <div>
                  <label>Email</label>
                  <input
                    onChange={this.handleChange}
                    name="email"
                    value={this.state.emailValue}
                  />
                  <label>Feedback</label>
                  <textarea
                    onChange={this.handleChange}
                    name="feedback"
                    value={this.state.feedbackValue}
                  />
                  <label>Name</label>
                  <input
                    onChange={this.handleChange}
                    name="name"
                    value={this.state.nameValue}
                  />
                  <label>Subject</label>
                  <input
                    onChange={this.handleChange}
                    name="subject"
                    value={this.state.subjectValue}
                  />
                </div>
              )}
              <button>Submit</button>
            </form>
          );
        }}
      />
    );
  }
}

export default App;
