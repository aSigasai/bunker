module.exports.pollRoom = function (roomMember, text) {
	return Poll.findOne({room: roomMember.room}).then(function (currentPoll) {
		var match = ["xx","xx"];
		var response = match[1];

		if(currentPoll && response) {

		}
		else if(!currentPoll && !response) {

		}
		else if(!currentPoll && response) {

		}

	});
};

function addResponse(poll, response) {
	PollOption.findOne({poll: currentPoll, index: response}).then(function (responseOptions){
		var newTally = responseOption.numberOfVotes + 1;
		return PollOption.update(poll.id, {numberOfVotes: newTally});
	})
}
