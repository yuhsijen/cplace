/**
 * REPORT: re-agenda-report-agenda-protocoll-management
 * -----------
 *
 * @author Christopher Wölfle <christopher.woelfle@daimler.com>
 * @version 1.0
 * @ada dtb.ada.agendaProtocolManagement
 * @type report
 * @description PDF Export of the Agenda of a meeting as table
 */
'use strict';

/**
 * Generates an error message containing the stack trace, log history and page url
 */

function generateErrorMessage(scriptIdentifier, page, history, error) {
    var _a;

    var logs = history.join('\n').replace('$', '§');
    var message = "an error occured in the script '"
        .concat(
            scriptIdentifier,
            "'.\n    Below you can find the error and logging output.\n    ---- Error ----------------------------------------------------------------------------\n    Name: "
        )
        .concat(error.name, '  \n    Message: ')
        .concat(error.message, ' \n    Stack: ')
        .concat(
            (_a = error.stack) === null || _a === void 0 ? void 0 : _a.replace('$', '§'),
            '\n    ---------------------------------------------------------------------------------------\n    \n    ---- Logs -----------------------------------------------------------------------------\n    '
        )
        .concat(
            logs,
            '\n    ---------------------------------------------------------------------------------------\n    \n    You can visit the page where the script was called under the following link:\n    '
        )
        .concat(page === null || page === void 0 ? void 0 : page.getUrl());
    return message;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

/**
 * Collection of functions regarding array/ArrayLike handling
 */
function asArray(arrayLike, Obj) {
    var arr = [];

    if (!arrayLike) {
        return [];
    }

    cplace.each(arrayLike, function (entry) {
        var objToPush = Obj == undefined ? entry : new Obj(entry);
        arr.push(objToPush);
    });
    return arr;
}
/**
 * Extract names from a single custom entity or an array of custom entities
 * and store them in a string array
 * @param entities Single Custom Entity or an Array of Custom Entities
 * @returns Array of Strings
 */

function createNameList(entities) {
    if (!entities) {
        return [];
    }

    if (Array.isArray(entities)) {
        return entities.map(function (entity) {
            return entity.getName();
        });
    }

    return [entities.getName()];
}

/**
 * Meeting Class
 * @param page A Meeting page
 */
var Meeting = function Meeting(page) {
    _classCallCheck(this, Meeting);

    this.page = page;
    this.id = page.getRealUid();
    this.name = page.getName();
    this.spaceId = page.getSpaceId();
    this.project = page.get('dtb.project');
    this.agendaProtocolManagement = page.get('dtb.agendaProtocolManagement');
    this.meetingType = page.get('dtb.meetingType');
    this.date = page.get('dtb.date');
    this.startTime = page.get('dtb.startTime');
    this.endTime = page.get('dtb.endTime');
    this.availableTime = page.get('dtb.availableTime');
    this.scheduledTime = page.get('dtb.scheduledTime');
    this.organizer = page.get('dtb.organizer');
    this.guests = page.get('dtb.guests');
    this.location = page.get('dtb.location');
    this.onlineMeetingLink = page.get('dtb.onlineMeetingLink');
    this.attachmentLink = page.get('dtb.attachmentLink');
    this.minutesVersion = page.get('dtb.minutesVersion');
    this.agendaVersion = page.get('dtb.agendaVersion');
    this.emailNotificationRecipients = page.get('dtb.emailNotificationRecipients');
};

/**
 * User Class
 * @param {Person} person
 */
var User = function User(person) {
    _classCallCheck(this, User);

    this.page = person;
    this.id = person.getRealUid();
    this.name = person.getName();
    this.department = person.get('com.daimler.ptm.base.department');
};

/**
 * AttendanceTracking Class
 * @param page A AttendanceTracking page
 */
var AttendanceTracking = function AttendanceTracking(page) {
    _classCallCheck(this, AttendanceTracking);

    this.page = page;
    this.id = page.getRealUid();
    this.name = page.getName();
    this.spaceId = page.getSpaceId();
    this.project = page.get('dtb.project');
    this.meeting = page.get('dtb.meeting');
    this.participant = page.get('dtb.participant');
    this.attendance = page.get('dtb.attendance');
    this.deputy = page.get('dtb.deputy');
};
var ATTENDANCE_TRACKING = {
    TYPE: 'dtb.attendanceTracking',
    ATTR: {
        PROJECT: 'dtb.project',
        MEETING: 'dtb.meeting',
        PARTICIPANT: 'dtb.participant',
        ATTENDANCE: 'dtb.attendance',
        DEPUTY: 'dtb.deputy',
    },
};

/**
 * MeetingTopic Class
 * @param page A MeetingTopic page
 */
var MeetingTopic = function MeetingTopic(page) {
    _classCallCheck(this, MeetingTopic);

    this.page = page;
    this.id = page.getRealUid();
    this.name = page.getName();
    this.spaceId = page.getSpaceId();
    this.title = page.get('dtb.title');
    this.topicShortDescription = page.get('dtb.topicShortDescription');
    this.project = page.get('dtb.project');
    this.subProject = page.get('dtb.subProject');
    this.time = page.get('dtb.time');
    this.duration = page.get('dtb.duration');
    this.speaker = page.get('dtb.speaker');
    this.guest = page.get('dtb.guest');
    this.sortingCplace = page.get('dtb.sortingCplace');
    this.sorting = page.get('dtb.sorting');
    this.followupMeeting = page.get('dtb.followupMeeting');
    this.followupMeetingDuration = page.get('dtb.followupMeetingDuration');
    this.originalMeetingTopic = page.get('dtb.originalMeetingTopic');
    this.meeting = page.get('dtb.meeting');
    this.relatedToDo = page.get('dtb.relatedToDo');
    this.protocol = page.get('dtb.protocol');
    this.date = page.get('dtb.date');
    this.meetingType = page.get('dtb.meetingType');
    this.originalReugularTopic = page.get('dtb.originalReugularTopic');
};
var MEETING_TOPIC = {
    TYPE: 'dtb.meetingTopic',
    ATTR: {
        TITLE: 'dtb.title',
        TOPIC_SHORT_DESCRIPTION: 'dtb.topicShortDescription',
        PROJECT: 'dtb.project',
        SUB_PROJECT: 'dtb.subProject',
        TIME: 'dtb.time',
        DURATION: 'dtb.duration',
        SPEAKER: 'dtb.speaker',
        GUEST: 'dtb.guest',
        SORTING_CPLACE: 'dtb.sortingCplace',
        SORTING: 'dtb.sorting',
        FOLLOWUP_MEETING: 'dtb.followupMeeting',
        FOLLOWUP_MEETING_DURATION: 'dtb.followupMeetingDuration',
        ORIGINAL_MEETING_TOPIC: 'dtb.originalMeetingTopic',
        MEETING: 'dtb.meeting',
        RELATED_TO_DO: 'dtb.relatedToDo',
        PROTOCOL: 'dtb.protocol',
        DATE: 'dtb.date',
        MEETING_TYPE: 'dtb.meetingType',
        ORIGINAL_REUGULAR_TOPIC: 'dtb.originalReugularTopic',
    },
};

/**
 * Get the meeting topic of a meeting
 */

function getMeetingTopics(meeting) {
    var topics = meeting.page.getIncomingPages(
        MEETING_TOPIC.TYPE,
        MEETING_TOPIC.ATTR.MEETING,
        meeting.spaceId
    );
    return asArray(topics, MeetingTopic)
        .filter(function (topic) {
            return topic.sorting ? topic.sorting > 0 : false;
        })
        .sort(orderMeetingTopicsByAgendaOrder);
}
/**
 * Sorting function for sorting an array of Meeting Topics
 */

function orderMeetingTopicsByAgendaOrder(a, b) {
    return (a.sorting ? a.sorting : 0) - (b.sorting ? b.sorting : 0);
}
/**
 * Get the attendance records of a meeting participant (user)
 */

function getAttendance(meeting) {
    var items = meeting.page.getIncomingPages(
        ATTENDANCE_TRACKING.TYPE,
        ATTENDANCE_TRACKING.ATTR.MEETING,
        meeting.spaceId
    );
    return asArray(items, AttendanceTracking);
}

/**
 * Logging object constructor.
 * You can either log a debug or info message to the cplace console.
 * If the DEBUG boolean is set to false only the info messages will be displayed in the console.
 * The logger stores a history of all messages without regards to the DEBUG flag.
 * This is useful in case of an error. Then for example, the whole logging history can be displayed.
 * @param scriptIdentifier The identifier of the low-code script
 * @param page A reference to a page (location from where the script was called)
 * @param debug Shall logging messages be shown or not
 * @param responsibleEmail Where shall email be send to
 * @returns
 */
function initializeLogger(scriptIdentifier, page, _debug) {
    var responsibleEmail = 'cplace-dtb@daimlertruck.com';
    var history = [];
    return {
        /**
         * Info logging message. This message will be outputed no
         * mather what the DEBUG variable is
         * @param args Any number of values to be logged
         */
        info: function info() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var message = ''.concat(scriptIdentifier, ' - INFO - ').concat(args.join(', '), '.'); // Add the log to the logs history

            history.push(message); // Output the message to the cplace LowCode Dashboard

            cplace.log(message);
        },

        /**
         * Debug logging message. This message will be outputed only
         * if the DEBUG variable is `true`.
         * @param args Any number of values to be logged
         */
        debug: function debug() {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var message = ''.concat(scriptIdentifier, ' - DEBUG - ').concat(args.join(', '), '.'); // Add the log to the logs history

            history.push(message); // Output the message to the cplace LowCode Dashboard
            // only if debug is enabled

            if (_debug) {
                cplace.log(message);
            }
        },
        returnState: function returnState() {
            return {
                history: history,
                responsibleEmail: responsibleEmail,
                page: page,
                scriptIdentifier: scriptIdentifier,
            };
        },

        /**
         * Set the reference to a page of the logger. The page's link will be sent in the error email.
         */
        setPage: function setPage(p) {
            page = p;
        },
    };
}

//                                       Logging                                        //
//--------------------------------------------------------------------------------------//

/** Is debug logging enabled? */

var DEBUG = true;
/** Script Identifier for logging purposes */

var SCRIPT_IDENTIFIER = 're-agenda-report-agenda-protocoll-management(dtb.ada.agendaProtocolManagement)'; // Initialize the logging function with the DEBUG flag

var log = initializeLogger(SCRIPT_IDENTIFIER, embeddingPage, DEBUG);

var Context = function Context(embeddingPage, pages, additionalData) {
    _classCallCheck(this, Context);

    log.debug('Setting up report context');
    this.embeddingPage = embeddingPage;
    this.pages = pages;
    this.meeting = new Meeting(embeddingPage);
    this.isDraft = this.meeting.agendaVersion === 'Draft';
    this.participants = asArray(this.meeting.emailNotificationRecipients, User);
    this.attendanceRecords = getAttendance(this.meeting);
    this.agendaPoints = getMeetingTopics(this.meeting);
    this.slotCounter = 0;
}; //--------------------------------------------------------------------------------------//
//                                   Getter Functions                                   //
//--------------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------------//
//                                Template Placeholders                                 //
//--------------------------------------------------------------------------------------//
var TEMPLATE = {
    SESSION: {
        TITLE: 'sessionTitle',
        SUBTITLE: 'sessionSubtitle',
    },
    PARTICIPANTS: {
        REGION: 'sessionParticipants',
        NAME: 'sessionParticipantName',
        DEPARTMENT: 'sessionParticipantDepartment',
        REMARKS: 'sessionParticipantRemarks',
    },
    SLOTS: {
        REGION: 'slots',
        NAME: 'slotName',
        TOPIC_PRESENTER_AND_GUESTS: 'topicPresenterAndGuests',
    },
    DRAFT_MARKER: 'draftMarker',
    AGENDA_TABLE: 'agendaTable',
    SESSION_LINK: 'sessionLink',
};

/**
 * Collection of functions regarding array/ArrayLike handling
 */
//--------------------------------------------------------------------------------------//
//                                       General                                        //
//--------------------------------------------------------------------------------------//

/**
 * Return the value if not null otherwise return the placeholder. Default '-'
 */
function saveGet(value, nullPlaceholder) {
    if (nullPlaceholder === undefined) {
        nullPlaceholder = '-';
    }

    if (value === null || value === undefined) {
        return nullPlaceholder;
    }

    return value;
}
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}
/**
 * Create an html link
 * ! Only in word reporting
 */

function createLink(display, link) {
    return '<a href="'.concat(link, '">').concat(display, '</a>');
}

/**
 * Collection of functions regarding dates
 */

/**
 * Formats the given joda date time. Pattern: dd.MM.yyyy
 * @param dateTime The date time to format
 * @param format The format of the date, default to 'MM/dd/yyyy'
 * @returns The formatted date as string
 */
function formatDate(dateTime) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'MM/dd/yyyy';
    return dateTime ? dateTime.toString(format) : '';
}
/**
 * Convert minutes to time string
 * @param {Number} n
 * @returns {string}
 */

function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + ':' + (rminutes < 10 ? '0' + rminutes : rminutes);
}

//                                      Main Logic                                      //
//--------------------------------------------------------------------------------------//

/**
 * Logic of the report
 */

function main(ctx, embeddingPage, pages) {
    report.addProgressMessage('Report started for session '.concat(ctx.meeting.name)); // ---- 2. Set report title --------------------------------------------------------------

    report.put(TEMPLATE.DRAFT_MARKER, ctx.isDraft ? ' Draft' : '');
    var filename = ctx.meeting.name + '_Agenda' + (ctx.isDraft ? '-Draft' : '');
    report.setFilename(slugify(filename), true); // ---- 3. Generate Agenda ---------------------------------------------------------------

    generateSessionAgenda(ctx);
    report.addProgressMessage('Generating agenda with ' + ctx.slotCounter + ' slots'); // ---- 4. Adding Session Link -----------------------------------------------------------

    var url = ctx.meeting.page.getUrl();
    var link = url ? createLink('Go to Meeting in cplace', url) : '';
    report.put(TEMPLATE.SESSION_LINK, Components.createText().withText(link).asHtml());
}
/**
 * Generate the agenda
 */

function generateSessionAgenda(ctx) {
    var tableHTML =
        '<style type="text/css"> .tb{border-collapse: collapse; border-spacing: 0; table-layout: fixed; width: 100%; text-align: center; vertical-align: top;}.tb .header{font-weight: bold; font-size: 16pt;}.tb td{border-color: black; border-style: solid; border-width: 1px; overflow: hidden; padding: 5px 5px; word-break: normal;}.tb .zeroPadding td{padding: 0px 5px;}.tb th{border-color: black; border-style: solid; border-width: 1px; overflow: hidden; padding: 10px 5px; word-break: normal;}.tb .yellow{background-color: #ffc702;}.tb .green{background-color: #40a519;}.tb .gray{background-color: #acadac;}.tb .left{text-align: left;}.tb .bold{font-weight: bold;}.tb .underline{text-decoration: underline;}ul{list-style-type: none;}ul > li:before{content: "\\2022";}</style><table class="tb"> <colgroup> <col style="width: 4%"/> <col style="width: 4%"/> <col style="width: 7%"/> <col style="width: 4%"/> <col style="width: 33%"/> <col style="width: 23%"/> <col style="width: 25%"/> </colgroup> <thead class="header"> <tr> <th colspan="3">{sessionDate}</th> <th colspan="3">{sessionTitle}</th> <th>{sessionNumber}</th> </tr></thead> <tbody> <tr class="zeroPadding"> <td colspan="3">German Time</td><td></td><td></td><td></td><td></td></tr><tr class="zeroPadding"> <td>from</td><td>until</td><td>Duration</td><td>TOP</td><td>Topic</td><td>Speaker</td><td>Responsible/Guests</td></tr><tr class="zeroPadding"> <td class="yellow">{sessionStart}</td><td class="yellow">{sessionEnd}</td><td class="yellow">{sessionDuration}</td><td class="yellow"></td><td class="yellow"></td><td class="yellow"></td><td class="yellow"></td></tr>';
    tableHTML = tableHTML.replace('{sessionDate}', formatDate(ctx.meeting.date)); // Create the table header

    var sessionTitle = 'Agenda ';
    sessionTitle += ctx.isDraft ? ' Draft ' : ' ';
    sessionTitle += ctx.meeting.name;
    tableHTML = tableHTML.replace('{sessionTitle}', saveGet(sessionTitle));
    tableHTML = tableHTML.replace('{sessionStart}', saveGet(ctx.meeting.startTime));
    tableHTML = tableHTML.replace('{sessionNumber}', ''); //TODO Can be added later

    tableHTML = tableHTML.replace('{sessionEnd}', saveGet(ctx.meeting.endTime));
    tableHTML = tableHTML.replace(
        '{sessionDuration}',
        '' // TODO Calculate the time
    ); // Region of guest section on first slide

    var guestRegion = Components.createRepeatableRegion(); // Add all agenda points to the table and the guest section

    ctx.agendaPoints.forEach(function (meetingTopic) {
        if (!meetingTopic.sorting) {
            return;
        }

        tableHTML += createAgendaTopicRow(ctx, meetingTopic, guestRegion);
        ctx.slotCounter++;
    });
    tableHTML += '</tbody></table>';
    var tableComponent = Components.createText().withText(tableHTML).asHtml();
    report.put(TEMPLATE.AGENDA_TABLE, tableComponent);
    report.put(TEMPLATE.SLOTS.REGION, guestRegion);
}
/**
 * Create an agenda row for a meeting topic.
 * Also adds the guest to the provided guest region
 */

function createAgendaTopicRow(ctx, meetingTopic, guestRegion) {
    var topicName = saveGet(meetingTopic.title);
    var topicShortDescription = saveGet(meetingTopic.topicShortDescription);
    var topicSpeakers = meetingTopic.speaker ? createNameList(Java.from(meetingTopic.speaker)) : [];
    var topicGuests = saveGet(meetingTopic.guest, '');
    var additionalHtml = createAgendaRowHTML(
        meetingTopic,
        topicName,
        meetingTopic.sorting,
        topicShortDescription,
        topicSpeakers.join('; '),
        topicGuests
    ); // ---- Guests section on first slide ----------------------------------------------------
    // Add the guests of the slot to first slide (guests section)

    var slotRegionData = guestRegion.addRegion();
    slotRegionData.put(TEMPLATE.SLOTS.NAME, meetingTopic.name);
    slotRegionData.put(TEMPLATE.SLOTS.TOPIC_PRESENTER_AND_GUESTS, topicGuests);
    return additionalHtml;
}
/**
 * Create the HTML for an agenda table row for either breaks/slots
 */

function createAgendaRowHTML(meetingTopic, title, position, description, speakers, guests) {
    var _a, _b;

    var startTime = saveGet((_a = meetingTopic.time) === null || _a === void 0 ? void 0 : _a.split('-')[0]);
    var endTime = saveGet((_b = meetingTopic.time) === null || _b === void 0 ? void 0 : _b.split('-')[1]);
    var duration = meetingTopic.duration ? '<i>' + timeConvert(meetingTopic.duration) + '</i>' : '-';
    var savePosition = saveGet(position, ''); // Set the CSS class of the whole row

    var rowClass = '';
    var titleHtml = '<div class="bold">' + title + '</div>';
    var descriptionHtml = description ? '<div>' + description + '</div>' : '';
    var topicSpeakersHtml = speakers;
    var topicGuestsHtml = '<p>' + guests + '</p>';
    var html = '<tr class="' + rowClass + '">';
    html += '<td>' + startTime + '</td>';
    html += '<td>' + endTime + '</td>';
    html += '<td>' + duration + '</td>';
    html += '<td class="bold">' + savePosition + '</td>';
    html += '<td>' + titleHtml + descriptionHtml + '</td>';
    html += '<td>' + topicSpeakersHtml + '</td>';
    html += '<td class="left">' + topicGuestsHtml + '</td>';
    return html;
}

try {
    // Initialize the context
    var ctx = new Context(embeddingPage, pages);
    main(ctx, embeddingPage, pages);
} catch (e) {
    var error = e;

    var _log$returnState = log.returnState(),
        history = _log$returnState.history,
        page = _log$returnState.page,
        scriptIdentifier = _log$returnState.scriptIdentifier;

    cplace.log(generateErrorMessage(scriptIdentifier, page, history, error));
    throw error;
}
