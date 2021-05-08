Cypress.Commands.add("login", (cb) => {
  cy.request({
    method:'POST',
    url: 'https://services-login-staging.dochq.co.uk/auth',
    body: {
      email: Cypress.env('email'),
      password: Cypress.env('password'),
    },
    auth: {
      bearer: "qj6WfxEpLg2WVjss",
    }
  })
  .its('body')
  .then(result => {
    cy.request({
      method:'POST',
      url: 'https://services-login-staging.dochq.co.uk/token',
      body: {
        role_id: result.id,
        organisation_id: result.organisation_id,
        user_id: result.user_id,
      },
      auth: {
        bearer: "qj6WfxEpLg2WVjss",
      }
    })
    .its('body')
    .then(token_result => {
      cy.request({
        method:'GET',
        url: `https://services-login-staging.dochq.co.uk/token/${token_result.token}`,
        auth: {
          bearer: "qj6WfxEpLg2WVjss",
        }
      })
      .its('body')
      .then(final_result => {
        cb(final_result.token)
      })
    })
  })
})
