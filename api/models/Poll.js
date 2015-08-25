module.exports = {
	attributes: {
		room: {
			model: 'Room'
		},
		question: {
			type: 'string',
			required: true
		},
		startTime: {
			type: 'date'
		}
	}
};
