import React, { Component } from "react";
import ZendeskFeedback from "./ZendeskFeedback";

class App extends Component {
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

  handleChange(event) {
    this.setState({ [`${event.target.name}Value`]: event.target.value });
  }

  render() {
    return (
      <ZendeskFeedback
        subdomain="abc-dev"
        preSubmit={this.handleValidate}
        postSubmit={this.doStuff}
        stubAPI="failure"
        render={({ handleSubmit, isLoading, isSubmitted, hasError }) => {
          return (
            <form
              onSubmit={e =>
                handleSubmit(
                  {
                    feedback: this.state.feedbackValue,
                    email: this.state.emailValue,
                    subject: this.state.subjectValue,
                    name: this.state.nameValue
                  },
                  e
                )
              }
            >
              {hasError && <p>FAIL!!!</p>}
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
