/**
 * Created by Owner on 7/29/2015.
 */
module.exports = {
	poll: {
		model: 'Poll'
	},
	responseOptions: {
		responseString: {
			type: 'string',
			required: true
		},
		numberOfVotes: {
			type: 'integer',
			required: true
		}
	}
};
