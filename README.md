# Zendesk React Feedback Form

A small app demonstrating how to build a custom feedback/contact form using the [Zendesk requests API](https://developer.zendesk.com/rest_api/docs/core/requests#create-request) and React.

## Purpose

[Zendesk](https://www.zendesk.com/) provides a [widget for embedding a simple contact form](https://www.zendesk.com/embeddables/web-widget/) on web pages. This widget gives limited control which is a problem for anyone wanting to heavily customise the user experience of submitting data to Zendesk.

This app shows how to integrate a totally custom React form with a Zendesk account.

## Zendesk account setup

To simplify the process for users, this form does not require users to be authenticated with Zendesk.

To allow anonymous requests, the following settings must be set in the Zendesk Support admin interface:

- Enable "Anyone can submit tickets"
- Disable "Require CAPTCHA"
- Disable "Ask users to register"

See [Managing end-user settings in the Zendesk](https://support.zendesk.com/hc/en-us/articles/203663806) Support Help Center.

## Run this app

Add your Zendesk subdomain as the `subdomain` prop on `<FeedbackForm />` in `/src/index.js`.

eg https://company-inc.zendesk.com/ => `<FeedbackForm subdomain="company-inc"/>`

Install dependencies:

`npm install`

Run the app

`npm run start`
