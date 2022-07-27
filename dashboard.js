/**
 * Last update 08.04.2022
 * Autor: suraj.james@daimler.com
 * Highchart location:
 *  1. dtb.ada.pmqd - Type: OU Dashboard
 *  2. dtb.ada.maturityManagement - Type: Project Management Quality Dashboard
 */

/// <reference path="../typeDefinitions/globals.d.ts" />

// -------------------------------------------------------------------------------------------------
// ------------------------------ Global Constants -----------------------------------------------
// -------------------------------------------------------------------------------------------------
const DEBUG = false;
const SCRIPT_IDENTIFIER = 'PMQD HeatMap';
/**
 * @type {Page}
 */
const currentPage = embeddingPage;
// -----------------------------------------------------------------------------------------
// ------------------------------ Data types -----------------------------------------------
// -----------------------------------------------------------------------------------------

const PROJECT = {
    TYPE: 'dtb.preProject',
    ATTR: {
        OU: 'dtb.leadOU',
        RELATED_PROJECT_EVALUATION: 'dtb.relatedProjectEvaluation',
        CONTAINING_SCHEDULE: 'containingSchedule',
        RATING_LIGHT: 'ratingLight',
        DATE: 'date',
        CVDS_ID: 'dtb.cvdsIdentifier',
    },
    RATING_LIGHT_RED: 'rot',
    RATING_LIGHT_YELLOW: 'gelb',
    RATING_LIGHT_GREEN: 'grün',
};
const PROJECT_CF = {
    TYPE: 'cf.projectNavigator.project',
    ATTR: {
        dtpl: 'dtb.preProject',
        qgrpe: 'dtb.lastQualityGateRelatedProjectEvaluation',
    },
};

// ---------------------------------------------------------------------------------------------//
// ------------------------------ Constructor Functions  -----------------------------------------  //
// ---------------------------------------------------------------------------------------------//

/**
 * Functional Group -Class
 * @param {Page} page
 */
function Project(page) {
    /** @type {Page} */
    this.page = page;

    /** @type {String} */
    this.id = page.getId();

    /** @type {String} */
    this.name = page.getName();

    /** @type {String} */
    this.link = page.getUrl();

    this.ou = page.get(PROJECT.ATTR.OU) ? page.get(PROJECT.ATTR.OU).getName() : '';

    this.projects =
        // page.get('dtb.dtbProject') ? [new Project_CF(page.get('dtb.dtbProject'))] : [];
        asArray(page.getIncomingPagesFromAllSpaces(PROJECT_CF.TYPE, PROJECT_CF.ATTR.dtpl), Project_CF); //Considering only Current workspace for Now
}

var tyx = 0;

/**
 * Functional Group -Class
 * @param {Page} page
 */
function Project_CF(page) {
    /** @type {Page} */
    this.page = page;

    /** @type {String} */
    this.id = page.getId();

    /** @type {String} */
    this.name = page.getName();

    /** @type {String} */
    this.link = page.getUrl();

    this.dtplId = page.get(PROJECT_CF.ATTR.dtpl) ? page.get(PROJECT_CF.ATTR.dtpl).get('dtb.projectID') : '';
    this.dtpl = page.get(PROJECT_CF.ATTR.dtpl) ? page.get(PROJECT_CF.ATTR.dtpl).getName() : '';
    this.lastQualityGateRelatedProjectEvaluation = page.get(PROJECT_CF.ATTR.qgrpe)
        ? new LastGQEvaluation(page.get(PROJECT_CF.ATTR.qgrpe))
        : '';

    if (this.lastQualityGateRelatedProjectEvaluation) {
        // tyx+=1;
        //cplace.log(tyx);
        //cplace.log(JSON.stringify(this.lastQualityGateRelatedProjectEvaluation, null, 2));
        // let projEvalPage = "";// this.lastQualityGateRelatedProjectEvaluation.get('dtb.evaluationDate');
        // this.subProjectEvaluations  =  [];//asArray(projEvalPage.getIncomingPagesFromAllSpaces('dtb.subProjectEvaluation', 'dtb.evaluationDate'), SubProjectEvaluation); //Considering only Current workspace for Now
        // this.deliverableEvaluations =  [];//asArray(projEvalPage.getIncomingPagesFromAllSpaces('dtb.deliverableEvaluation', 'dtb.evaluationDate'), DeliverableEvaluation); //Considering only Current workspace for Now

        let projEvalPage = this.lastQualityGateRelatedProjectEvaluation.page.get('dtb.evaluationDate');
     
      //cplace.log("projEvalPage" + projEvalPage);
      //cplace.log(this.lastQualityGateRelatedProjectEvaluation.page.getUrl());
        //cplace.log("works");
      //cplace.log(projEvalPage.getName());
      //cplace.log("Works");

      
        this.subProjectEvaluations = projEvalPage?asArray(
            projEvalPage.getIncomingPagesFromAllSpaces('dtb.subProjectEvaluation', 'dtb.evaluationDate'),
            SubProjectEvaluation
        ): []; //Considering only Current workspace for Now
        this.deliverableEvaluations = projEvalPage?asArray(
             projEvalPage.getIncomingPagesFromAllSpaces('dtb.deliverableEvaluation', 'dtb.evaluationDate'),
            DeliverableEvaluation
        ):[]; //Considering only Current workspace for Now
    } else {
        this.deliverableEvaluations = [];
        this.deliverableEvaluations = [];
    }
}

/**
 * Functional Group -Class
 * @param {Page} page
 */
function DeliverableEvaluation(page) {
    /** @type {Page} */
    this.page = page;

    /** @type {String} */
    this.id = page.getId();

    /** @type {String} */
    this.name = page.getName();

    /** @type {String} */
    this.link = page.getUrl();
    this.status = page.get('dtb.status') ? page.get('dtb.status') : '';
    this.description = page.get('dtb.comment') ? page.get('dtb.comment') : '';
}

/**
 * Functional Group -Class
 * @param {Page} page
 */
function LastGQEvaluation(page) {
    /** @type {Page} */
    this.page = page;

    /** @type {String} */
    this.id = page.getId();

    /** @type {String} */
    this.name = page.getName();

    //this.qg = page.getName('dtb.project');
    this.qgdate = page.get('dtb.dateOfEvaluationDate')
        ? page.get('dtb.dateOfEvaluationDate').toString('dd/MM/YYYY')
        : '';

    /** @type {String} */
    this.link = page.getUrl();

    this.status = page.get('dtb.assessment') ? page.get('dtb.assessment') : '';
    this.description = page.get('dtb.comment') ? page.get('dtb.comment') : '';
}

function SubProjectEvaluation(page) {
    /** @type {Page} */
    this.page = page;

    /** @type {String} */
    this.id = page.getId();

    /** @type {String} */
    this.name = page.getName();

    /** @type {String} */
    this.link = page.getUrl();

    this.subProjName = page.get('dtb.subProject') ? page.get('dtb.subProject') : '';

    this.status = page.get('dtb.assessment') ? page.get('dtb.assessment') : '';
    this.description = page.get('dtb.comment') ? page.get('dtb.comment') : '';
}

// ---------------------------------------------------------------------------------------------//
// ------------------------------ Support Functions  -----------------------------------------  //
// ---------------------------------------------------------------------------------------------//

function log(msg) {
    if (DEBUG) cplace.log(msg);
}

/**
 *
 * @param {Array} objectArray
 * @param {String} property
 * @returns {Object}
 */
function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        let key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

/**
 * Converts an ArrayLike to an array.
 * If a object is specified object is initialized with the entry.
 * @template T
 * @param {ArrayLike} arrayLike
 * @param {new() => T} Obj
 * @return {Array<T>}
 */
function asArray(arrayLike, Obj) {
    var arr = [];
    if (!arrayLike) {
        return arr;
    }
    cplace.each(arrayLike, function (entry) {
        const objToPush = Obj == undefined ? entry : new Obj(entry);
        arr.push(objToPush);
    });
    return arr;
}

/**
 * Formats the given joda date time. Pattern: dd.MM.yyyy
 *
 * @param dateTime The date time to format
 * @returns {string} The formatted date as String
 */
function formatDate(dateTime) {
    return dateTime ? dateTime.toString('dd.MM.yyyy') : '';
}

/**
 * Builds a HTML-filtered text of the given rich string.
 *
 * @param richString The rich string to convert
 * @returns {string} The filtered text
 */
function buildHtmlFilteredText(richString) {
    return richString
        ? Components.createText().withText(richString).filterHtml().getProcessedText().replaceFirst('\n', '')
        : '';
}

/**
 * Builds an image using an existing enum icon defined by the given page and enum attribute.
 *
 * @param {Page} project The page to extract the enum attribute from
 * @param {Project} project The internal attribute name of the enum to extract
 * @returns {ImageComponent}
 */
function buildEnumIcon(page, attributeName) {
    return Components.createImage().withEnumIcon(page, attributeName);
}

/**
 * Limit a string by the given max size.
 * @param {string} str
 * @param {number} maxSize
 */
function limitString(str, maxSize) {
    if (!str) {
        return '-';
    }
    if (str.length > maxSize) {
        return str.slice(0, maxSize - 3) + '...';
    }
    return String(str);
}

// Modified log function with script identifier
function log(message) {
    if (DEBUG) {
        cplace.log(SCRIPT_IDENTIFIER + ': ' + message);
    }
}
function logError(error) {
    cplace.error(SCRIPT_IDENTIFIER + ' Error: ' + error);
}

/**
 * Converts an ArrayLike to an array.
 * If a object is specified object is initialized with the entry.
 * @template T
 * @param {ArrayLike} arrayLike
 * @param {new() => T} Obj
 * @return {Array<T>}
 */
function asArray(arrayLike, Obj) {
    var arr = [];
    if (!arrayLike) {
        return arr;
    }
    cplace.each(arrayLike, function (entry) {
        const objToPush = Obj == undefined ? entry : new Obj(entry);
        arr.push(objToPush);
    });
    return arr;
}

// -------------------------------------------------------------------------------------------------
// ------------------------------ START HighChart GENERATION ------------------------------------------
// -------------------------------------------------------------------------------------------------

cplace.setLogName(embeddingPage.getId());
let allcatsProjects = asArray(pages, Project);
let linkedallcatsProjects = allcatsProjects.filter((catsProject) => catsProject.projects.length > 0);
const ouObjs = groupBy(linkedallcatsProjects, 'ou');
//cplace.utils().getPageByName('00.413 - TA Fighter MY19').getIncomingPages(PROJECT_CF.TYPE,)
log(JSON.stringify(ouObjs));
let ouArr = [];
ouArr = Object.keys(ouObjs);
//Report Generation logic goes here

const colors = {
    green: '#059705',
    red: '#ff0000',
    orange: '#ffae19',
    white: '#FFFFFF',
};
const symbols = {
    check: '&#10004;',
    cross: '&#10060;',
    dash: '➖',
    downtrend: '↘',
    uptrend: '↖',
};

var metrics = [
    'Linked cPlace Projects',
    'Last QG Evaluations \n Existing',
    'Project Evaluations \n (Last QG)',
    'Sub Project / Functional \n Evaluations (Last QG)',
    'Deliverable Evaluations (Last QG)',
];

var projs = [];
var dtplID = [];
let projectsObjs = []; //Use this all metrics caluclations other than total
Object.keys(ouObjs).forEach((ou) => {
    projectsObjs.push(ou);
    let projectsArr = ouObjs[ou].map((cfProject) => cfProject.projects);
    projectsObjs = projectsObjs.concat(projectsArr.reduce((acc, curr) => acc.concat(curr), []));
});

projs = projectsObjs.map((project) => (typeof project === 'string' ? project : project.name));

//cplace.log(JSON.stringify(projs, null, 2));
// cplace.log(JSON.stringify(projectsObjs))
let projsLinks = [];

var projmetricsData = [];
for (let projsIndex = 0; projsIndex < projs.length; projsIndex++) {
    var projects = [];

    if (ouArr.indexOf(projs[projsIndex]) > -1) {
        projects = ouObjs[projs[projsIndex]].map((proj) => proj.projects);
        projects = projects.reduce((acc, curr) => acc.concat(curr), []);
    }
    log(JSON.stringify(projects));
    for (let metrixIndex = 0; metrixIndex < metrics.length; metrixIndex++) {
        let val = 'XX';
        let percent = 0.0;
        let tooltipVal = '';

        let bgColor = colors.white;
        let dataLabel = {};
        if (metrixIndex === 0) {
            //Linked cplace project

            if (ouArr.indexOf(projs[projsIndex]) > -1) {
                //let  projects =  ouObjs[projs[projsIndex]].map(proj=>proj.projects);

                projsLinks.push(null);
                dtplID.push(null);
                let num = projects.length;
                let den = allcatsProjects.filter((proj) => proj.ou === projs[projsIndex]).length;

                // cplace.log(JSON.stringify( allcatsProjects.filter(proj => proj.ou === projs[projsIndex])));
                //cplace.log(JSON.stringify( projects));

                let notLinkedNames = [];
                let notLinkedPages = [];
                allcatsProjects
                    .filter((proj) => proj.ou === projs[projsIndex])
                    .forEach((x) => {
                        if (x.projects.length <= 0) {
                            notLinkedNames.push(x.name);
                            notLinkedPages.push(x.link);
                        }
                    });
                // cplace.log(JSON.stringify(notLinkedNames));

                percent = den ? ((num / den) * 100).toFixed(1) : 'NA';
                val = num + '/' + den + ' (' + percent + '%)';
                bgColor = colors.orange;
                if (notLinkedNames.length > 0) {
                    tooltipVal = '<h4>Unlinked cPlace Projects</h4> ';
                    notLinkedNames.forEach(
                        (x, i) =>
                            (tooltipVal +=
                                '<b>' +
                                (i + 1) +
                                '.</b> <a href=' +
                                notLinkedPages[i] +
                                ' target="_blank">' +
                                x +
                                '</a> <br/>')
                    );
                }
            } else {
                // cplace.log(JSON.stringify(projects))
                //tooltipVal=projectsObjs[projsIndex]? projectsObjs[projsIndex].name:"";
                let projPage = projectsObjs[projsIndex] ? projectsObjs[projsIndex].link : '';
                // cplace.log(projectsObjs[projsIndex]?JSON.stringify(projectsObjs[projsIndex].dtpl?projectsObjs[projsIndex].dtplId:"" ):"")
                dtplID.push(
                    projectsObjs[projsIndex]
                        ? projectsObjs[projsIndex].dtpl
                            ? projectsObjs[projsIndex].dtplId
                            : ''
                        : ''
                );
                val =
                    '<a href=' +
                    projPage +
                    ' style = "color:' +
                    colors.green +
                    '" target="_blank">' +
                    symbols.check +
                    '</a>';
                projsLinks.push(projPage);
                dataLabel = {
                    enabled: true,
                    useHTML: true,
                    color: colors.green,
                    style: {
                        textOutline: false,
                    },
                };
            }
            projmetricsData.push({
                actualVal: val,
                x: metrixIndex,
                y: projsIndex,
                value: 0,
                color: bgColor,
                dataLabels: dataLabel,
                toolTip:
                    '<div style="border:1px solid black;padding:5px 5px;background-color:white !important">' +
                    tooltipVal +
                    '</div>',
            });
        } else if (metrixIndex === 1) {
            //Last QG Evaluation Existing

            let val = '';
            let percent = 0.0;
            let tooltipVal = '';
            let enableTooltip = false;

            if (ouArr.indexOf(projs[projsIndex]) > -1) {
                let num = projects.reduce(
                    (acc, curr) => (curr.lastQualityGateRelatedProjectEvaluation ? acc + 1 : acc),
                    0
                );
                let den = projects.length;
                percent = den ? ((num / den) * 100).toFixed(1) : 'NA';
                val = num + '/' + den + ' (' + percent + '%)';
                bgColor = colors.orange;
            } else {
                //  Use projectsObjs[projsIndex] to get project related values
                //cplace.log("This is me")
                //let qg = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation? projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation.page.get(PROJECT_CF.TYPE).get():"";
                let qg = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation
                    ? projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation.name
                    : '';
                qg = qg.match(/QG \w+/i) ? qg.match(/QG \w+/i) : '';
                // cplace.log(JSON.stringify(qg));
                val = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation
                    ? symbols.check + ' (' + qg + ')'
                    : symbols.cross;
                let clr = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation
                    ? colors.green
                    : colors.red;
                tooltipVal = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation
                    ? 'Evaluation Date: ' +
                      projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation.qgdate
                    : 'NA';
                dataLabel = {
                    enabled: true,
                    useHTML: true,
                    color: clr,
                    style: {
                        textOutline: false,
                    },
                };
            }
            projmetricsData.push({
                actualVal: val,
                x: metrixIndex,
                y: projsIndex,
                value: 0,
                color: bgColor,
                dataLabels: dataLabel,
                toolTip:
                    '<div style="border:1px solid black;padding:5px 5px;background-color:white !important">' +
                    tooltipVal +
                    '</div>',
                enableTooltip: enableTooltip,
            });
        } else if (metrixIndex === 2) {
            //Project Evaluation (last QG)
            let val = '';
            let percent = 0.0;
            let dataLabel = {};
            let tooltipVal = '';
            let enableTooltip = true;
            let heading = false;

            if (ouArr.indexOf(projs[projsIndex]) > -1) {
                let num = projects.reduce(
                    (acc, curr) =>
                        curr.lastQualityGateRelatedProjectEvaluation &&
                        (curr.lastQualityGateRelatedProjectEvaluation.status ||
                            curr.lastQualityGateRelatedProjectEvaluation.description)
                            ? acc + 1
                            : acc,
                    0
                );

                let den = projects.reduce(
                    (acc, curr) => (curr.lastQualityGateRelatedProjectEvaluation ? 1 + acc : acc),
                    0
                );

                percent = den ? ((num / den) * 100).toFixed(1) : 'NA';
                val = num + '/' + den + ' (' + percent + '%)';
                bgColor = colors.orange;
                heading = true;
            } else {
                //  Use projectsObjs[projsIndex] to get project related values
                heading = false;

                let lastEvalProj = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation;
                let num = lastEvalProj && (lastEvalProj.status || lastEvalProj.description) ? 1 : 0;

                let den = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation ? 1 : 0;

                let evalColor = den
                    ? projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation.status
                        ? '<span><h4> Evaluation: </h4>' +
                          projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation.status +
                          '</span>'
                        : ''
                    : '';

                let description = den
                    ? projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation.description
                        ? '<h4>Description: </h4>' +
                          projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation.description
                        : ''
                    : '';
                tooltipVal = evalColor + '</br>' + description;

                if (num == 1 && den == 1) {
                    val = symbols.check;
                    dataLabel = {
                        enabled: true,
                        useHTML: true,
                        color: colors.green,
                        style: {
                            textOutline: false,
                        },
                    };
                } else if (num == 0 && den == 1) {
                    val = symbols.cross;
                    dataLabel = {
                        enabled: true,
                        useHTML: true,
                        color: colors.red,
                        style: {
                            textOutline: false,
                        },
                    };
                } else {
                    val = symbols.dash;
                    percent = den ? ((num / den) * 100).toFixed(1) : 'NA';
                    tooltipVal = num + '/' + den + ' (' + percent + '%)';
                    enableTooltip = false;
                    dataLabel = {
                        enabled: true,
                        useHTML: true,
                        style: {
                            textOutline: false,
                            fontWeight: 'normal',
                        },
                    };
                }
            }
            //    percent = den? (num/den *100).toFixed(1):"NA";
            //    val = num + "/" + den +" ("+percent+"%)";

            projmetricsData.push({
                actualVal: val,
                x: metrixIndex,
                y: projsIndex,
                value: heading,
                toolTip:
                    '<div style="border:1px solid black;padding:5px 5px;background-color:white !important">' +
                    tooltipVal +
                    '</div>',
                color: bgColor,
                dataLabels: dataLabel,
                enableTooltip: enableTooltip,
            });
        } else if (metrixIndex === 3) {
            //Sub Project / Functional Evaluations (last QG)
            let val = '';
            let percent = 0.0;
            let tooltipVal = '';

            if (ouArr.indexOf(projs[projsIndex]) > -1) {
                let num = projects.reduce(
                    (acc, curr) =>
                        curr.lastQualityGateRelatedProjectEvaluation
                            ? curr.subProjectEvaluations.reduce(
                                  (pre, nxt) => (nxt.status || nxt.description ? pre + 1 : pre),
                                  0
                              ) + acc
                            : acc,
                    0
                );

                let den = projects.reduce(
                    (acc, curr) =>
                        curr.lastQualityGateRelatedProjectEvaluation
                            ? curr.subProjectEvaluations.length + acc
                            : acc,
                    0
                );

                percent = den ? ((num / den) * 100).toFixed(1) : 'NA';
                val = num + '/' + den + ' (' + percent + '%)';
                bgColor = colors.orange;
            } else {
                //  Use projectsObjs[projsIndex] to get project related values
                let num = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation
                    ? projectsObjs[projsIndex].subProjectEvaluations.reduce(
                          (pre, nxt) => (nxt.status || nxt.description ? pre + 1 : pre),
                          0
                      )
                    : 0;

                let den = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation
                    ? projectsObjs[projsIndex].subProjectEvaluations.length
                    : 0;

                // cplace.log(JSON.stringify(projectsObjs[projsIndex].subProjectEvaluations));

                let sortedSubProj = den
                    ? projectsObjs[projsIndex].subProjectEvaluations.sort((a, b) =>
                          a.subProjName.name < b.subProjName.name
                              ? -1
                              : a.subProjName.name > b.subProjName.name
                              ? 1
                              : 0
                      )
                    : '';
                //sortedSubProj.forEach(a=>cplace.log(JSON.stringify(a.subProjName.name)));
                // if(den)projectsObjs[projsIndex].subProjectEvaluations.forEach(x=> cplace.log(x.subProjName.name));

                tooltipVal = den
                    ? sortedSubProj.reduce(
                          (pre, nxt, i) =>
                              nxt.status || nxt.description
                                  ? pre + nxt.subProjName.name + ' : ' + nxt.status + '</br>'
                                  : pre,
                          ''
                      )
                    : '';

                percent = den ? ((num / den) * 100).toFixed(1) : 'NA';

                if (den == 0) {
                    val = symbols.dash;
                    tooltipVal = num + '/' + den + ' (' + percent + '%)';
                } else {
                    val = num + '/' + den + ' (' + percent + '%)';
                }

                dataLabel = {
                    enabled: true,
                    useHTML: true,
                    style: {
                        textOutline: false,
                        fontWeight: 'normal',
                    },
                };
            }

            projmetricsData.push({
                actualVal: val,
                x: metrixIndex,
                y: projsIndex,
                value: 0,
                color: bgColor,
                dataLabels: dataLabel,
                toolTip:
                    '<div style="border:1px solid black;padding:5px 5px;background-color:white !important">' +
                    tooltipVal +
                    '</div>',
            });
        } else if (metrixIndex === 4) {
            //Deliverable Evaluations

            let val = '';
            let percent = 0.0;
            let tooltipVal = '';

            if (ouArr.indexOf(projs[projsIndex]) > -1) {
                let num = projects.reduce(
                    (acc, curr) =>
                        curr.lastQualityGateRelatedProjectEvaluation
                            ? curr.deliverableEvaluations.reduce(
                                  (pre, nxt) => (nxt.status || nxt.description ? pre + 1 : pre),
                                  0
                              ) + acc
                            : acc,
                    0
                );

                let den = projects.reduce(
                    (acc, curr) =>
                        curr.lastQualityGateRelatedProjectEvaluation
                            ? curr.deliverableEvaluations.length + acc
                            : acc,
                    0
                );

                percent = den ? ((num / den) * 100).toFixed(1) : 'NA';
                val = num + '/' + den + ' (' + percent + '%)';
                // val = num + "/" + den;
                bgColor = colors.orange;
            } else {
                //  Use projectsObjs[projsIndex] to get project related values
                let num = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation
                    ? projectsObjs[projsIndex].deliverableEvaluations.reduce(
                          (pre, nxt) => (nxt.status || nxt.description ? pre + 1 : pre),
                          0
                      )
                    : 0;

                let den = projectsObjs[projsIndex].lastQualityGateRelatedProjectEvaluation
                    ? projectsObjs[projsIndex].deliverableEvaluations.length
                    : 0;

                percent = den ? ((num / den) * 100).toFixed(1) : 'NA';

                if (den == 0) {
                    val = symbols.dash;
                    tooltipVal = num + '/' + den + ' (' + percent + '%)';
                } else {
                    val = num + '/' + den + ' (' + percent + '%)';
                }

                dataLabel = {
                    enabled: true,
                    useHTML: true,
                    style: {
                        textOutline: false,
                        fontWeight: 'normal',
                    },
                };
            }

            projmetricsData.push({
                actualVal: val,
                x: metrixIndex,
                y: projsIndex,
                value: 0,
                color: bgColor,
                dataLabels: dataLabel,
                toolTip:
                    '<div style="border:1px solid black;padding:5px 5px;background-color:white !important">' +
                    tooltipVal +
                    '</div>',
            });
            //  projmetricsData.push(lastQGEvaluationsRatio(projsIndex,projects,"deliverableEvaluations",metrixIndex));
        }
    }
}

// cplace.log(JSON.stringify(dtplID))

//Begin Sort
let start = 0;
let end = 0;
let ind = [];
let rowval = [];

projmetricsData.forEach((data) => {
    if (data.x === 2)
        if (data.value) rowval.push('HEAD');
        else rowval.push(data.actualVal);
});

for (let s of ouArr) {
    if (rowval[start] === 'HEAD') {
        ind.push(start++);
        let i = start;
        let pos = i;

        //Group and sort by Check
        while (i < rowval.length && rowval[i] != 'HEAD') {
            if (rowval[i] == symbols.check) ind.push(i);
            i++;
        }
        end = ind.length;
        if (end > start) {
            sort(ind, projs, start, end);
            start = end;
        }

        i = pos;
        //Group and sort by Cross
        while (i < rowval.length && rowval[i] != 'HEAD') {
            if (rowval[i] == symbols.cross) ind.push(i);
            i++;
        }
        end = ind.length;
        if (end > start) {
            sort(ind, projs, start, end);
            start = end;
        }

        i = pos;
        //Group and sort by Dash
        while (i < rowval.length && rowval[i] != 'HEAD') {
            if (rowval[i] == symbols.dash) ind.push(i);
            i++;
        }
        end = ind.length;
        if (end > start) {
            sort(ind, projs, start, end);
            start = end;
        }
        //index sort
    }
}

function sort(ind, row, start, end) {
    let newrow = [];
    let newind = [];
    let j = 0;

    for (let i = start; i < end; i++) newrow.push(row[ind[i]]);

    newind = newrow
        .map((val, i) => {
            i = ind[i + start];
            return { i, val };
        })
        .sort((a, b) => {
            return a.val > b.val ? 1 : a.val == b.val ? 0 : -1;
        })
        .map((obj) => obj.i);

    j = 0;
    for (let i = start; i < end; i++) ind[i] = newind[j++];
}

//cplace.log(JSON.stringify(ind, null, 2));

projs = projs.map((x, i) => projs[ind[i]]);
projsLinks = projsLinks.map((x, i) => projsLinks[ind[i]]);
dtplID = dtplID.map((x, i) => dtplID[ind[i]]);

projs = projs.map((x, i) =>
    projsLinks[i]
        ? '<a href= "' + projsLinks[i] + '" target="_blank">' + x + '</a>' + '</br> (' + dtplID[i] + ')'
        : '<b>' + x + '</b>'
);

// projs = projs.map((x,i) => projsLinks[i]? x+'</br>'+dtplID[i] : x);

projmetricsData.forEach((data, i) => {
    let pos = (i / projmetricsData.length) * projs.length;
    let ipos = parseInt(pos.toString().indexOf('.9999') > -1 ? Math.floor(pos) + 1 : pos);
    data.y = ind.indexOf(ipos);
});

let height = '1px';
if (projs.length > 0) height = (projs.length + 1) * 75 + 'px';

//cplace.log(JSON.stringify(projmetricsData, null, 2));

var chartObj = {
    chart: {
        type: 'heatmap',
        plotBorderWidth: 1,
        height: height,
    },
    title: {
        text: 'Product Management Quality Dashboard',
    },
    xAxis: {
        categories: metrics,
        opposite: true,
        labels: {
            style: {
                fontSize: '13px',
            },
        },
    },
    yAxis: {
        categories: projs,
        reversed: true,
        title: null,
        useHTML: true,
        labels: {
            useHTML: true,
            style: {
                fontSize: '13px',
            },
        },
    },
    tooltip: {
        hideDelay: 1100,
        headerFormat: '{',
        outside: false,
        pointFormat: '{point.toolTip}',
        useHTML: true,
        enabled: true,
        borderColor: '#1f77b4',
        backgroundColor: 'white',
        style: {
            color: 'black',
            pointerEvents: 'auto',
        },
        shadow: false,
        stickOnContact: true,
    },
    legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        enabled: false,
    },
    colorAxis: {
        dataClasses: [
            {
                from: 0,
                to: 20,
                color: '#ffffff',
                name: 'White',
            },
        ],
    },
    series: [
        {
            borderWidth: 1,
            data: projmetricsData,
            dataLabels: {
                enabled: true,
                useHTML: true,
                format: '{point.actualVal}',
                color: '#000000',
                style: {
                    textOutline: false,
                    fontSize: '15px',
                },
            },
        },
    ],
};
return chartObj;
