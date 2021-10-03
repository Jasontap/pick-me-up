const db = require('../db')
const Sequelize = require('sequelize')
const { STRING, INTEGER, ENUM, BOOLEAN } = Sequelize;

// not being used at the moment but could be if we have enough time
//Everything has been simplified to get us started :)
const Request = db.define(
	"request",
	{
		// this will need to be changed starting off really restirctive to  make testing
		// easier will need to replaced with LAT, LONG I assume
		location: {
			type: ENUM("COURT 1", "COURT 2", "COURT 3", "COURT 4", "COURT 5"),
		},
		// I think date and time can go together, keeping it very simple at the moment
		// just time date will be added back again very restrive for testing
		time: {
			type: INTEGER,
		},
		//it would be better if it just checked the time to see if it was an
		//open and closed request but this should work for now
		open: {
			type: BOOLEAN,
			defaultValue: true,
		},
		team: {
			type: STRING,
		},
		waitlist: {
			type: BOOLEAN,
			defaultValue: false,
		},
		baskets: {
			type: INTEGER,
		}
	},
	{ timestamps: false }
);


module.exports = Request;
