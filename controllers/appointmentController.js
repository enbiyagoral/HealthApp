const Response = require('../utils/response');
const { Doctor } = require('../models/User');

async function getAppointments(req, res) {
    const { filter, name, surname } = req.query; // spec

    const filterConditions = {};

    if (filter) {
        filterConditions.specialization = filter
    }

    if (name) {
        filterConditions.name = new RegExp(`.*${name}.*`, 'i');
    }

    if (surname) {
        filterConditions.surname = new RegExp(`.*${surname}.*`, 'i');
    }

    try {
        const doctors = await Doctor.find(filterConditions).select("-__v -email -iban");
        return new Response(200, null, doctors).success(res);
    } catch (error) {
        console.error(error);
        return new Response(500, error.message, null).error500(res);
    }
}

module.exports = { getAppointments };