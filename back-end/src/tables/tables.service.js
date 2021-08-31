const { orderBy } = require("../db/connection");
const knex = require("../db/connection");

/**
 * Get reservation by id
 * @param {*} reservation_id 
 * @returns 
 */
function getReservationById(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

/**
 * list tables by name
 * @returns 
 */
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

/**
 * create table
 * @param {} newTable 
 * @returns 
 */
function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((tables) => tables[0]);
}

/**
 * Read Table by id
 * @param {*} tableId 
 * @returns 
 */
function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

/**
 * set reservation 
 * @param {*} table_id 
 * @param {*} reservation_id 
 * @returns 
 */
function setReservationToTable(table_id, reservation_id) {
  return knex("tables")
    .update({ reservation_id }, "*")
    .where({ table_id })
    .then((tables) => tables[0]);
}

/**
 * Remove reservation from table
 * @param  table_id 
 * @returns 
 */
function removeReservationFromTable(table_id) {
  return knex("tables")
    .update({ reservation_id: null }, "*")
    .where({ table_id })
    .then((tables) => tables[0]);
}

module.exports = {
  getReservationById,
  list,
  create,
  read,
  setReservationToTable,
  removeReservationFromTable,
};