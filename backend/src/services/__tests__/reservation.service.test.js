// Tests UNITAIRES : on isole reservation.service.js de tout le reste
// (base de données réelle, serveur HTTP...) en remplaçant ("mockant") ses
// dépendances. On vérifie ainsi la logique métier pure, rapidement et sans
// dépendre d'une base de données PostgreSQL démarrée.

jest.mock("../../repositories/reservation.repository");
jest.mock("../../repositories/timeSlot.repository");
jest.mock("../../repositories/closingDay.repository");
jest.mock("../../models", () => ({
  sequelize: { transaction: jest.fn((options, cb) => cb()) },
  RestaurantSettings: { findOne: jest.fn() },
}));

const reservationRepository = require("../../repositories/reservation.repository");
const timeSlotRepository = require("../../repositories/timeSlot.repository");
const closingDayRepository = require("../../repositories/closingDay.repository");
const { RestaurantSettings } = require("../../models");
const reservationService = require("../reservation.service");
const AppError = require("../../utils/AppError");

function futureDateString(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

const validPayload = () => ({
  firstName: "Marie",
  lastName: "Dupont",
  email: "marie@exemple.fr",
  phone: "0600000000",
  date: futureDateString(5),
  service: "dinner",
  time: "19h30",
  guests: 4,
  message: "",
});

describe("reservationService.createReservation", () => {
  beforeEach(() => {
    // Comportement par défaut : restaurant ouvert, pas de fermeture exceptionnelle,
    // créneau existant et actif avec une grande capacité.
    RestaurantSettings.findOne.mockResolvedValue({ closedWeekday: 1 }); // lundi fermé
    closingDayRepository.findByDate.mockResolvedValue(null);
    timeSlotRepository.findByServiceAndTime.mockResolvedValue({ id: 1, capacity: 20, isActive: true });
    reservationRepository.sumGuestsForSlot.mockResolvedValue(0);
    reservationRepository.create.mockImplementation((data) => Promise.resolve({ id: 42, ...data }));
  });

  test("crée la réservation quand toutes les règles sont respectées", async () => {
    const result = await reservationService.createReservation(validPayload());

    expect(result.id).toBe(42);
    expect(reservationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: "pending", timeSlotId: 1 }),
      expect.anything()
    );
  });

  test("rejette une réservation avec un champ obligatoire manquant (400)", async () => {
    const payload = { ...validPayload(), email: "" };
    await expect(reservationService.createReservation(payload)).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(reservationRepository.create).not.toHaveBeenCalled();
  });

  test("rejette une date déjà passée (400)", async () => {
    const payload = { ...validPayload(), date: futureDateString(-3) };
    await expect(reservationService.createReservation(payload)).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test("rejette une réservation un jour de fermeture hebdomadaire (400)", async () => {
    // On force la date du payload à tomber un lundi (jour fermé selon le mock RestaurantSettings).
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((7 + 1 - today.getDay()) % 7 || 7));
    const payload = { ...validPayload(), date: nextMonday.toISOString().slice(0, 10) };

    await expect(reservationService.createReservation(payload)).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test("rejette une réservation un jour de fermeture exceptionnelle (400)", async () => {
    closingDayRepository.findByDate.mockResolvedValue({ date: validPayload().date, reason: "Privatisation" });

    await expect(reservationService.createReservation(validPayload())).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test("rejette si le créneau demandé n'existe pas (400)", async () => {
    timeSlotRepository.findByServiceAndTime.mockResolvedValue(null);

    await expect(reservationService.createReservation(validPayload())).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test("rejette avec 409 si la capacité du créneau est dépassée", async () => {
    timeSlotRepository.findByServiceAndTime.mockResolvedValue({ id: 1, capacity: 10, isActive: true });
    reservationRepository.sumGuestsForSlot.mockResolvedValue(8); // déjà 8 couverts réservés

    const payload = { ...validPayload(), guests: 5 }; // 8 + 5 = 13 > 10

    await expect(reservationService.createReservation(payload)).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(reservationRepository.create).not.toHaveBeenCalled();
  });

  test("accepte une réservation qui atteint exactement la capacité restante", async () => {
    timeSlotRepository.findByServiceAndTime.mockResolvedValue({ id: 1, capacity: 10, isActive: true });
    reservationRepository.sumGuestsForSlot.mockResolvedValue(6);

    const payload = { ...validPayload(), guests: 4 }; // 6 + 4 = 10 (pile la capacité)

    await expect(reservationService.createReservation(payload)).resolves.toBeDefined();
    expect(reservationRepository.create).toHaveBeenCalled();
  });
});

describe("reservationService.updateReservationStatus", () => {
  test("lève une erreur 400 si le statut demandé est invalide", async () => {
    await expect(reservationService.updateReservationStatus(1, "en_cours_de_rien")).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test("lève une erreur 404 si la réservation n'existe pas", async () => {
    reservationRepository.findById.mockResolvedValue(null);

    await expect(reservationService.updateReservationStatus(999, "confirmed")).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  test("met à jour le statut quand la réservation existe", async () => {
    reservationRepository.findById.mockResolvedValue({ id: 1, status: "pending" });
    reservationRepository.updateStatus.mockResolvedValue([1]);

    await reservationService.updateReservationStatus(1, "confirmed");

    expect(reservationRepository.updateStatus).toHaveBeenCalledWith(1, "confirmed");
  });
});
