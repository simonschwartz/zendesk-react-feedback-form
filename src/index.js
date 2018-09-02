import React from "react";
import ReactDOM from "react-dom";
import FeedbackForm from "./FeedbackForm";

ReactDOM.render(
  <FeedbackForm
    subdomain="YOUR_ZENDESK_SUBDOMAIN_HERE"
    currentPageURL={window.location}
  />,
  document.getElementById("root")
);
