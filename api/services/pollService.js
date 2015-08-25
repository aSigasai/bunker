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
}

function addResponse(currentPoll, responseNumber) {
	PollOption.findOne({poll: currentPoll, responseNumber: responseNumber}).then(function (responseOption){
		var newTally = responseOption.numberOfVotes + 1;
		return PollOption.update(poll.id, response.Number, {numberOfVotes: newTally});
	})
}

function createPoll(roomMember, question, responses) {
	var poll = getPoll(roomMember, question);
	if (!poll) {
		return null;
	}
	else {
		var count = 1;
		// async execution of the round creation
		_.each(responses, function(response){
			PollOption.create({
				poll: poll.id,
				responseNumber: count,
				responseString: response,
				})
		});		
	}
}


function getPoll(roomMember, question) {
	// put check in here for active poll within last 5 minutes.
	return Poll.findOne({
		room: roomMember.room.id,
		question: question,
	}).then(function (poll) {
		if (poll) {
			return null;
		}
		else {
			return Poll.create({room: roomMember.room.id, question: question, startTime: moment()});
		}
	});
}
