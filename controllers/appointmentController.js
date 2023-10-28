const Response = require('../utils/response');
const { Doctor } = require('../models/User');

async function getAppointments(req, res) {
    const { filter, name, surname } = req.query; // spec
    const page = parseInt(req.params.page);
    
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
        const perPage = 10;
        const skip = (page-1) * perPage;
        
        const doctors = await Doctor.find(filterConditions)
            .select("-__v -email -iban")            
            .skip(skip)
            .limit(perPage)

        if(doctors.length==0){
            return new Response(404, null, null).error404(res);
        }
        return new Response(200, null, doctors).success(res);
    } catch (error) {
        console.error(error);
        return new Response(500, error.message, null).error500(res);
    }
}

module.exports = { getAppointments };