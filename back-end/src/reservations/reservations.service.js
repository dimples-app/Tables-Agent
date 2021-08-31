const knex = require("../db/connection");

/**
 * list by date
 * @param {*} date 
 * @returns 
 */
const list = (date) => {
  if (date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time")
      .then((reservations) =>
        reservations.filter((reservation) => reservation.status !== "finished")
      );
  }

  return knex("reservations")
    .select("*")
    .orderBy("reservation_time")
    .then((reservations) =>
      reservations.filter((reservation) => reservation.status !== "finished")
    );
};

/**
 * create new reservation
 * @param {*} newReservation 
 * @returns 
 */
const create = (newReservation) => {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((reservations) => reservations[0]);
};

/**
 * read reservation
 * @param {} reservation_id 
 * @returns 
 */
const read = (reservation_id) => {
  return knex("reservations").select("*").where({ reservation_id }).first()
};

/**
 * update reservation status
 * @param {*} reservation_id 
 * @param {*} status 
 * @returns 
 */
const updateReservationStatus = (reservation_id, status) => {
  return knex("reservations")
    .update({ status }, "*")
    .where({ reservation_id })
    .then((reservations) => reservations[0]);
};

/***
 * search by phone number
 */
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

/**
 * update reservation
 * @param {*} reservation_id 
 * @param {*} param1 
 * @returns 
 */
function update(reservation_id, {...updatedReservation}) {
  //console.log({reservation_id})
  return knex("reservations")
    .where({ reservation_id: Number(reservation_id) }, '*')
    .update(updatedReservation)
    .then(() => updatedReservation);
   
}

module.exports = {
  list,
  create,
  read,
  updateReservationStatus,
  search,
  update,
};