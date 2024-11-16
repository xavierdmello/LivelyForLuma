// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Lively, Event} from "../src/Lively.sol";
import {Vm} from "forge-std/Vm.sol";

contract DeployLively is Script {
    // Custom struct for JSON parsing that excludes stats
    struct EventJson {
        string name;
        string host;
        string venue;
        string imageUrl;
        string lumaLink;
        uint256 start;
        uint256 end;
        int long;
        int lat;
    }

    Lively public lively;

    function setUp() public {}

    function run() public returns (Lively) {
        vm.startBroadcast();

        lively = new Lively();
     
        EventJson[] memory eventJsons = getEvents();

        for (uint i = 0; i < eventJsons.length; i++) {
            EventJson memory event_ = eventJsons[i];
            lively.createEvent(
                event_.name,
                event_.host,
                event_.venue,
                event_.imageUrl,
                event_.lumaLink,
                event_.start,
                event_.end,
                event_.long,
                event_.lat
            );
        }

        vm.stopBroadcast();

        return lively;
    }
    
    function getEvents() public view returns (EventJson[] memory) {
        EventJson[] memory events = new EventJson[](2);
        
        events[0] = EventJson({
            name: "Event 1",
            host: "Host 1",
            venue: "Venue 1",
            imageUrl: "https://...",
            lumaLink: "https://...",
            start: 1234567890,
            end: 1234567899,
            long: 1234567890,
            lat: 1234567890
        });

        events[1] = EventJson({
            name: "Event 1",
            host: "Host 1",
            venue: "Venue 1",
            imageUrl: "https://...",
            lumaLink: "https://...",
            start: 1234567890,
            end: 1234567899,
            long: 1234567890,
            lat: 1234567890
        });

        return events;
    }
}
