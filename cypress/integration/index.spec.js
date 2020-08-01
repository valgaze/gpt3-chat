describe("settings", () => {
  beforeEach(() => {
    const $activateBtn = `div.wrap > div.nes-field.is-inline > button:nth-child(3)`;
    cy.visit("/");
    cy.get($activateBtn).click();
    //   .wait(1000);

    const $settingsBtn = `div.wrap > div.nes-field.is-inline > button:nth-child(4)`;
    // Dark mode
    cy.get($settingsBtn)
      .click()
      .wait(1000);
  });

  it("darkmode", () => {
    const $darkmode = `#dialog-default > form > div:nth-child(2) > label:nth-child(1) > span`;
    cy.get($darkmode)
      .click()
      .wait(1000);

    const $modal = `#dialog-default`;
    const bgColor = `rgb(33, 37, 41)`;
    cy.get($modal)
      .should("have.css", "background-color")
      .and("eq", bgColor);

    cy.get($modal).type("{esc}");
  });

  /**
   * Change/save backend
   * Show/hide avatars
   * Debug
   * etc
   */
});

describe("Command history", () => {
  // Command history
  it("command history", () => {
    const mint = `i want small mint ice cream!`;
    const broc = `i want large broccoli ice cream!`;

    cy.get("#chat__input")
      .type(mint)
      .type("{enter}")
      .type(broc)
      .type("{enter}")
      .type("{uparrow}")
      .should("have.value", broc)
      .wait(100);

    cy.get("#chat__input")
      .type("{uparrow}")
      .should("have.value", mint)
      .clear();
  });
});

describe("request modal", () => {
  it("session cycler", () => {
    const $activateBtn = `div.wrap > div.nes-field.is-inline > button:nth-child(3)`;
    cy.visit("/");
    cy.get($activateBtn).click();
    //   .wait(1000);

    const $requestBtn = `div.wrap > div.nes-field.is-inline > button:nth-child(5)`;
    // Dark mode
    cy.get($requestBtn)
      .click()
      .wait(1000);

    const $cycler = `#dialog-settings > form > div.nes-container.with-title > div.content-wrap > div:nth-child(4) > label`;
    const $session = `#dialog-settings > form > div.nes-container.with-title > div.content-wrap > div:nth-child(4) > input`;

    cy.get($session)
      .invoke("val")
      .then((sessionVal) => {
        cy.log(sessionVal);
        cy.get($cycler).click();
        //   .wait(100);
        cy.get($session).should("not.have.value", sessionVal);
      });

    // const $modal = `#dialog-default`;
    // cy.get($modal).type("{esc}");
  });
});
