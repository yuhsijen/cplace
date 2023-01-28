/*
 * @author Alex JEN, Yu-Hsi <yu-hsi.jen@daimler.com>
 * @version 1.0
 * @description: Show the To-be and As-is releases for parts tracking list (fuso) 
 * @Used at: tooling project, show graphical notification for:           
 * Last update: 2023-01-24
 * ATTRIBUTRE: dtb.plannedToolingLeadTime, 
 */

const PLANTOOLINGLT = {
    TYPE: '',
    ATTR: {
        planToolingLeadTime: 'dtb.plannedToolingLeadTime',
    },
};

const ACTUALTOOLINGLT = {
    TYPE: '',
    ATTR: {
        actualToolingLeadTime: 'dtb.actualToolingLeadTime',
    },
};

const ANALYSISTOOLINGLT = {
    TYPE: '',
    ATTR: {
        AnalysisOfToolingLeadTime: 'dtb.analysisToolingLeadTime',
    },
};

var page = changeEvent.getEntity();
var plannedMonths = page.get(PLANTOOLINGLT.ATTR.planToolingLeadTime);
var actualMonths = page.get(ACTUALTOOLINGLT.ATTR.actualToolingLeadTime);
var calculationResult;
if (plannedMonths === null || actualMonths === null) {
    calculationResult = "Enter Planned/Actual leadtime in months";
}
else {
    if (actualMonths <= plannedMonths) {
        calculationResult = "In time";
    }
    else {
        calculationResult = "Critical";
    }
}

cplace.actions().updatePage(page, {
    customAttributes: {
        'dtb.analysisToolingLeadTime': calculationResult
    }
}
);
page.registerAttributeForRefresh(ANALYSISTOOLINGLT.ATTR.AnalysisOfToolingLeadTime);
