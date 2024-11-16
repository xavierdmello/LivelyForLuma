// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

struct Stats {
    int8 overall;
    int8 food;
    int8 technical;
    int8 networking;
    int8 fun;
    int8 swag;
}

struct Event {
    string name;
    string host;
    string venue;
    string imageUrl;
    string lumaLink;
    uint256 start;
    uint256 end;
    int long;
    int lat;
    Stats stats;
}

contract Lively {
    Event[] public events;

    // Check if a user has already rated event
    mapping (uint256 => mapping (address => bool)) public hasRated;

    function createEvent(
        string memory _name,
        string memory _host,
        string memory _venue,
        string memory _imageUrl,
        string memory _lumaLink,
        uint256 _start,
        uint256 _end,
        int _long,
        int _lat
    ) public {
        Stats memory initialStats = Stats(0, 0, 0, 0, 0, 0);
        
        events.push(Event({
            name: _name,
            host: _host,
            venue: _venue,
            imageUrl: _imageUrl,
            lumaLink: _lumaLink,
            start: _start,
            end: _end,
            long: _long,
            lat: _lat,
            stats: initialStats
        }));
    }

    // Vote types: 1 for upvote, 2 for downvote, 0 for no vote
    function rateEvent(
        uint256 eventId,
        uint8 overallVote,
        uint8 foodVote,
        uint8 technicalVote,
        uint8 networkingVote,
        uint8 funVote,
        uint8 swagVote
    ) public {
        require(eventId < events.length, "Event does not exist");
        require(overallVote == 1 || overallVote == 2, "Overall vote is required");
        require(!hasRated[eventId][msg.sender], "User has already rated this event");

        // Verify user is checked into event in Luma (eg. they actually attended)
        verifyAttendance(eventId, msg.sender);

        Event storage event_ = events[eventId];
        
        // Update overall rating (required)
        if (overallVote == 1) {
            event_.stats.overall += 1;
        } else {
            event_.stats.overall -= 1;
        }
        
        // Update optional ratings
        if (foodVote != 0) {
            event_.stats.food += (foodVote == 1) ? int8(1) : int8(-1);
        }
        if (technicalVote != 0) {
            event_.stats.technical += (technicalVote == 1) ? int8(1) : int8(-1);
        }
        if (networkingVote != 0) {
            event_.stats.networking += (networkingVote == 1) ? int8(1) : int8(-1);
        }
        if (funVote != 0) {
            event_.stats.fun += (funVote == 1) ? int8(1) : int8(-1);
        }
        if (swagVote != 0) {
            event_.stats.swag += (swagVote == 1) ? int8(1) : int8(-1);
        }

        hasRated[eventId][msg.sender] = true;
    }

    // Verify user is checked into event in Luma (eg. they actually attended). Placeholder. Assuming we had access to the Luma API which is $70/mo :(
    function verifyAttendance(uint256 eventId, address user) public returns (bool) {
        return true;
    }   
}
