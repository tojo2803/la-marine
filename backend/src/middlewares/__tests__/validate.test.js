const { validateReservationInput } = require("../validate");

function mockReqRes(body) {
  const req = { body };
  const res = {};
  const next = jest.fn();
  return { req, res, next };
}

const validBody = {
  firstName: "Marie",
  lastName: "Dupont",
  email: "marie@exemple.fr",
  date: "2027-01-15",
  service: "lunch",
  time: "12h30",
  guests: 4,
};

describe("validateReservationInput", () => {
  test("appelle next() sans erreur quand toutes les données sont valides", () => {
    const { req, res, next } = mockReqRes(validBody);
    validateReservationInput(req, res, next);
    expect(next).toHaveBeenCalledWith(); // appelé sans argument = pas d'erreur
  });

  test.each([
    ["prénom manquant", { ...validBody, firstName: "" }],
    ["nom manquant", { ...validBody, lastName: "  " }],
    ["email invalide", { ...validBody, email: "pas-un-email" }],
    ["date au mauvais format", { ...validBody, date: "15/01/2027" }],
    ["service invalide", { ...validBody, service: "brunch" }],
    ["heure manquante", { ...validBody, time: "" }],
    ["nombre de personnes à 0", { ...validBody, guests: 0 }],
    ["nombre de personnes trop élevé", { ...validBody, guests: 13 }],
    ["nombre de personnes non entier", { ...validBody, guests: 2.5 }],
  ])("rejette avec une AppError 400 : %s", (label, body) => {
    const { req, res, next } = mockReqRes(body);
    validateReservationInput(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const errorPassed = next.mock.calls[0][0];
    expect(errorPassed).toBeDefined();
    expect(errorPassed.statusCode).toBe(400);
  });
});
