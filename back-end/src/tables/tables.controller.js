const { table } = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");

async function validateNewTable(req, res, next) {
  // check that 'data' is present
  if (!req.body.data) {
    return next({
      status: 400,
      message: "Request body must have a 'data'",
    });
  }

  const tableData = req.body.data;

  // check for 'table_name' is missing
  if (tableData.table_name === undefined) {
    return next({
      status: 400,
      message: "Request body is missing 'table_name'",
    });
  }

  // check if 'table_name' is empty
  if (tableData.table_name === "") {
    return next({
      status: 400,
      message: "'table_name' should not be empty",
    });
  }

  // check if 'table_name' is less than 2 characters
  if (tableData.table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name must be atleast 2 characters long",
    });
  }

  // check for 'capacity' is missing
  if (tableData.capacity === undefined) {
    return next({
      status: 400,
      message: "Request body is missing 'capacity'",
    });
  }

  tableData.capacity = Number(tableData.capacity);

  // check if 'capacity' is 1 or greater
  if (tableData.capacity < 1) {
    return next({
      status: 400,
      message: "capacity must be 1 or greater",
    });
  }

  res.locals.newTable = tableData;
  next();
}

/**
 * if table exist
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

async function tableExists(req, res, next) {
  const { tableId } = req.params;

  const foundTable = await service.read(Number(tableId));
  if (!foundTable) {
    return next({
      status: 404,
      message: `Table with id - ${tableId} not found.`,
    });
  }

  res.locals.table = foundTable;
  next(); 
}

/**
 * is table occupied
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function tableIsOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id === null) {
    return next({
      status: 400,
      message: `Table is not occupied.`,
    });
  }

  next();
}

/**
 * validate seat reservation
 * @param {v} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function validateSeatReservation(req, res, next) {
  // check for 'data'
  if (req.body.data === undefined) {
    return next({
      status: 400,
      message: "Request body must have a 'data'",
    });
  }

  // check if reservation_id is missing
  if (req.body.data.reservation_id === undefined) {
    return next({
      status: 400,
      message: "Request body must have a 'reservation_id' property.",
    });
  }

  const { table } = res.locals;
  const { reservation_id } = req.body.data;
  const reservation = await service.getReservationById(Number(reservation_id));

  // if no reservation found for provided id then throw error
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation for id ${reservation_id} not found.`,
    });
  }

  // if reservation found, check if reservation party size is less than or equal to table capacity
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: "Reservation party size exceeds table capacity.",
    });
  }

  // If the reservation is already 'seated', throw error.
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: "Reservation has already been seated",
    });
  }

  // also check if table is free
  if (table.reservation_id) {
    return next({
      status: 400,
      message: "Table is already occupied.",
    });
  }
  next();
}

/**
 * Get list of table
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}

/**
 *  Post Table 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function create(req, res, next) {
  const newTable = res.locals.newTable;

  const data = await service.create(newTable);

  res.status(201).json({ data });
}

/**
 * Reserve table by reservation id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function seatReservation(req, res, next) {
  const { reservation_id } = req.body.data;
  const { table } = res.locals;

  const data = await service.setReservationToTable(table.table_id, Number(reservation_id));

  await reservationsService.updateReservationStatus(Number(reservation_id), "seated");

  res.json({ data });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function freeTable(req, res, next) {
  const table = res.locals.table;
  const reservation_id = table.reservation_id;

  await service.removeReservationFromTable(table.table_id);
  const data = await reservationsService.updateReservationStatus(
    Number(reservation_id),
    "finished"
  );

  res.json({ data });
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [validateNewTable, asyncErrorBoundary(create)],
  seatReservation: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(validateSeatReservation),
    asyncErrorBoundary(seatReservation),
  ],
  freeTable: [asyncErrorBoundary(tableExists), tableIsOccupied, asyncErrorBoundary(freeTable)],
};