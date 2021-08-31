/**
 * List handler for reservation resources
 */

 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 const service = require("./reservations.service");

 // display list by mobile search or date
 async function list(req, res, next) {
   const { mobile_number } = req.query;
   if (mobile_number) {
     const results = await service.search(mobile_number);
     return res.json({ data: results });
   }
 
   const { date } = req.query;
   const data = await service.list(date);
 
   res.json({
     data,
   });
 }
 
 /**
  * check new reservation with valid data
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  * @returns 
  */
 function hasNewReservationWithValidProperties(req, res, next) {

   const REQUIRED_PROPERTY = [
     "first_name",
     "last_name",
     "mobile_number",
     "reservation_date",
     "reservation_time",
     "people",
   ];
 
   const newReservation = req.body.data;
   if (!newReservation) {
     return next({
       status: 400,
       message: "Couldn't find data. Ensure data in your request",
     });
   }
 
   // check missing property
   const isPropsMissing = REQUIRED_PROPERTY.filter((prop) => !newReservation[prop]);
  
   if (isPropsMissing.length) {
     return next({
       status: 400,
       message: `Following props are missing: ${isPropsMissing.join(", ")}`,
     });
   }

  for (let property in newReservation) {
    if (property !== "people" && property !== "reservation_id") {
      if (newReservation[property] && !newReservation[property].length) {
        return next({
          status: 400,
          message: `${property} cannot be empty. ${property}: ${newReservation[property]}`,
        });
      }
    }
  }
 
   //check reservation date is valid
   const timeStamp = Date.parse(newReservation.reservation_date);
   if (isNaN(timeStamp)) {
     return next({
       status: 400,
       message: "reservation_date is invalid",
     });
   }
 
   //check time
   const timeReg = /\d\d:\d\d/;
   const time = newReservation.reservation_time;
   if (!time.match(timeReg)) {
     return next({
       status: 400,
       message: "reservation_time is invalid",
     });
   }
 
   // check people is valid
   const people = newReservation.people;
   if (typeof people !== "number" || people < 1 ) {
     return next({
       status: 400,
       message: "people is invalid",
     });
   }
 
   // check if date falls on a Tuesday
   const date = new Date(`${newReservation.reservation_date}T${newReservation.reservation_time}:00`);
   const dateOnly = new Date(`${newReservation.reservation_date}`)

   if (dateOnly.getUTCDay() === 2 ) {
     return next({
       status: 400,
       message: "The restaurant is closed on Tuesdays. Invalid date.",
     });
   } 
 
   // check if date is in past
   const todaysDate = new Date();
   if (date < todaysDate) {
     return next({
       status: 400,
       message: "Select date from in future. Invalid date.",
     });
   }
 
   // check if time is before  10:30am
   const hours = date.getHours();
   const mins = date.getMinutes();
   if (hours < 10 || (hours === 10 && mins < 30)) {
     return next({
       status: 400,
       message: "Cannot reserve a time before the restaurant opens at 10:30am",
     });
   }
 
   // check if time is after 9:30pm. 
   if ((hours === 21 && mins > 30) || (hours === 22 && mins < 30)) {
     return next({
       status: 400,
       message: "Cannot reserve a time after 9:30 PM. Too close to closing time.",
     });
   }
 
   // check if time is after 10:30pm.
   if (hours > 22 || (hours === 22 && mins >= 30)) {
     return next({
       status: 400,
       message: "Cannot reserve a time after 10:30 PM. Restaurant closes at 10:30 PM.",
     });
   }
 
   // check if reservation status is 'seated' or 'finished'
   if (newReservation.status === "seated" || newReservation.status === "finished") {
     return next({
       status: 400,
       message: `Reservation status cannot be '${newReservation.status}'. Status must be 'booked' `,
     });
   }
 
   next();
 }
 
 async function isReservationExists(req, res, next) {
   const { reservation_id } = req.params;
 
   const foundReservation = await service.read(Number(reservation_id));
 
   if (!foundReservation) {
     return next({
       status: 404,
       message: `Reservation for id ${reservation_id} not found.`,
     });
   }
 
   res.locals.reservation = foundReservation;
   next();
 }
 
 async function validateStatus(req, res, next) {
   const { status } = req.body.data;
 
   const VALID_STATUS_VALUES = ["booked", "seated", "finished", "cancelled"];
 
   // If the status is an unknown value, then throw error.
   if (!VALID_STATUS_VALUES.includes(status)) {
     return next({
       status: 400,
       message: `Status: ${status} is unknown.`,
     });
   }
 
 
   if (res.locals.reservation.status === "finished") {
     return next({
       status: 400,
       message: `Reservation has been finished and cannot be updated.`,
     });
   }
 
   next();
 }
 
 //CRUD operation

 /**
  * Create reservation 
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  */
 async function create(req, res, next) {
   const reservation = req.body.data;
   const data = await service.create(reservation);
 
   res.status(201).json({ data });
 }
 
 /**
  * read reservation
  * @param {} req 
  * @param {*} res 
  * @param {*} next 
  */
 async function read(req, res, next) {
   const data = res.locals.reservation;
   //console.log("read")
 
   res.json({ data });
 }
 
 /**
  * update reservation by status
  * @param {} req 
  * @param {*} res 
  */
 async function updateReservationStatus(req, res) {
   const { reservation_id } = req.params;
   const { status } = req.body.data;
 
   const data = await service.updateReservationStatus(Number(reservation_id), status);
 
   res.json({ data });
 }
 
 /**
  * update reservation
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  */
 async function update(req, res, next) {
  const updatedReservation = {...req.body.data};
  const { reservation_id } = req.params;
  const data = await service.update(reservation_id, {...updatedReservation});
  res.json({ data: data });

 }
 //module export
 module.exports = {
   list: [asyncErrorBoundary(list)],
   create: [ hasNewReservationWithValidProperties, asyncErrorBoundary(create)],
   read: [asyncErrorBoundary(isReservationExists), asyncErrorBoundary(read)],
   updateReservationStatus: [
     asyncErrorBoundary(isReservationExists),
     validateStatus,
     asyncErrorBoundary(updateReservationStatus),
   ],
   update: [
     asyncErrorBoundary(isReservationExists),
     hasNewReservationWithValidProperties,
     asyncErrorBoundary(update),
   ],
 };
 