module.exports = {
	attributes: {
		room: {
			model: 'Room'
		},
		question: {
			type: 'string',
			required: true
		},
		responseOptions: {
			model: 'PollOption'
		}
	}
};
