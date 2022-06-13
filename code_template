/*
Xiang Lou
21.12.2021

changeListener Name: Copy Meeting Regular Info to Project Meeting + generate attendance tracking items (XL)
In Type: Meeting
Listen to attribute 
    - Agenda & Protocol Manangement 

Note: This changeListener has 2 functions, which defined in the meeting type
    - copy the meeting regular info to the project meeting
    - generate the attendance tracking items (all regular participants) automatically
    
    regular info: participants, online meeting link, attachment link, location

Update 
21.12.2021: "dtb.originalReugularTopic" in type Meeting Topic will

*/

const MEETING = {
    TYPE: 'dtb.meeting',
    ATTR: {
        MEETING_TYPE: 'dtb.meetingType',
        PROJECT: 'dtb.project',
        START_TIME: 'dtb.startTime',
        END_TIME: 'dtb.endTime',
        AVAILABLE_TIME: 'dtb.availableTime',
        SCHEDULED_TIME: 'dtb.scheduledTime',
        PARENT: 'dtb.agendaProtocolManagement',
        PARTICIPANTS: 'dtb.participants',
        ONLINE_MEETING_LINK: 'dtb.onlineMeetingLink',
        ATTACHMENT_LINK: 'dtb.attachmentLink',
    },
};

const MEETING_TYPE = {
    TYPE: 'dtb.meetingType',
    ATTR: {
        REGULAR_PARTICIPANTS: 'dtb.regularParticipants',
        ONLINE_MEETING_LINK: 'dtb.onlineMeetingLink',
        ATTACHMENT_LINK: 'dtb.attachmentLink',
        LOCATION: 'dtb.location',
        START_TIME: 'dtb.regularStartTime',
        END_TIME: 'dtb.regularEndTime',
    },
};

const REGULAR_MEETING_TOPIC = {
    TYPE: 'dtb.regularMeetingTopic',
    ATTR: {
        PARENT: 'dtb.agendaProtocolManagement',
        MEETING_TYPE: 'dtb.meetingType',
        PROJECT: 'dtb.project',
        SUB_PROJECT: 'dtb.subProject',
        DURATION: 'dtb.duration',
        SPEAKER: 'dtb.speaker',
        SHORT_DESCRIPTION: 'dtb.topicShortDescription',
    },
};

const PROJECT = {
    TYPE: 'cf.projectNavigator.project',
    ATTR: {
        PARENT: 'parent',
    },
};

let page = changeEvent.getEntity();

/////////////////////////////////
// Copy the regular participants
/////////////////////////////////
let meetingType = page.getOptional(MEETING.ATTR.MEETING_TYPE);
let participants_cplace = meetingType.get(MEETING_TYPE.ATTR.REGULAR_PARTICIPANTS);
//let participants_cplace = page.get('dtb.agendaProtocolManagement').get(MEETING_TYPE.ATTR.REGULAR_PARTICIPANTS)
/*
let participants_js = []

cplace.each(participants_cplace, function(page) {
      participants_js.push(page) 
});
*/

cplace.actions().updatePage(page, {
    customAttributes: {
        //      'dtb.participants': participants_js,
        'dtb.onlineMeetingLink': meetingType.get(MEETING_TYPE.ATTR.ONLINE_MEETING_LINK),
        'dtb.attachmentLink': meetingType.get(MEETING_TYPE.ATTR.ATTACHMENT_LINK),
        'dtb.location': meetingType.get(MEETING_TYPE.ATTR.LOCATION),
        'dtb.startTime': meetingType.get(MEETING_TYPE.ATTR.START_TIME),
        'dtb.endTime': meetingType.get(MEETING_TYPE.ATTR.END_TIME),
    },
});
page.registerAttributeForRefresh('dtb.participants');
page.registerAttributeForRefresh('dtb.onlineMeetingLink');
page.registerAttributeForRefresh('dtb.attachmentLink');
page.registerAttributeForRefresh('dtb.location');
page.registerAttributeForRefresh('dtb.regularStartTime');
page.registerAttributeForRefresh('dtb.regularEndTime');

/////////////////////////////////
// Copy the regular meeting topics
/////////////////////////////////

//let agendaProtocolManagement = page.get(MEETING.ATTR.PARENT)
let regularMeetingTopics_cplace = meetingType.getIncomingPages(
    REGULAR_MEETING_TOPIC.TYPE,
    REGULAR_MEETING_TOPIC.ATTR.MEETING_TYPE
);

cplace.each(regularMeetingTopics_cplace, function (regularMeetingTopic) {
    cplace.actions().createPage(
        {
            space: regularMeetingTopic.getSpaceId(),
            customType: 'dtb.meetingTopic',
            customAttributes: {
                'dtb.title': regularMeetingTopic.getName(),
                'dtb.meeting': page.getId(),
                'dtb.subProject': convertArrayCplace2JS(
                    regularMeetingTopic.get(REGULAR_MEETING_TOPIC.ATTR.SUB_PROJECT)
                ),
                'dtb.duration': regularMeetingTopic.get(REGULAR_MEETING_TOPIC.ATTR.DURATION),
                'dtb.speaker': convertArrayCplace2JS(
                    regularMeetingTopic.get(REGULAR_MEETING_TOPIC.ATTR.SPEAKER)
                ),
                'dtb.topicShortDescription': regularMeetingTopic.get(
                    REGULAR_MEETING_TOPIC.ATTR.SHORT_DESCRIPTION
                ),
                'dtb.originalReugularTopic': regularMeetingTopic, // update 21.12.2021
            },
        },
        {
            setGeneratedName: true,
        }
    );
}); // end of cplace.each

// function for converting cplace array to Javascript array
function convertArrayCplace2JS(ARRAY_CPLACE) {
    let ARRAY_JS = [];
    cplace.each(ARRAY_CPLACE, function (PAGE) {
        ARRAY_JS.push(PAGE);
    });
    return ARRAY_JS;
}

/////////////////////////////////
// Create Attendance Tracking items (reular participants) automatically
/////////////////////////////////

let project = page.get(MEETING.ATTR.PROJECT);

//cplace.log(participants_cplace)
//cplace.log(project)

cplace.each(participants_cplace, function (participant) {
    cplace.actions().createPage(
        {
            space: page.getSpaceId(),
            customType: 'dtb.attendanceTracking',
            customAttributes: {
                'dtb.project': project,
                'dtb.participant': participant.getId(),
                'dtb.meeting': page.getId(),
            },
        },
        {
            setGeneratedName: true,
        }
    );
}); // end of cplace.each
