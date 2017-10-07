describe("My First Test", function() {
  it("Visits the debug page", function() {
    cy.visit("http://127.0.0.1:8080/demo/debug.html");
    cy.get("li.rz-tick:nth-of-type(8)").click();
    cy.get(".rz-model-value").should("have.text", "35");
  });
});
