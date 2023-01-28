/*
 * @author Alex JEN, Yu-Hsi <yu-hsi.jen@daimler.com>
 * @version 1.0
 * @description: Show the To-be and As-is releases for parts tracking list (fuso) 
 * If “hotai” supplier – same year quarter as parts target delivery time. 
 * (e.g: Parts delivery target date: 12 January 2023 -> budget consumption: Q1/2023)
 * If “overseas” or “ippan” supplier – same year quarter as PPAP/ISIR date (PPAP date inputted by QM or LCM*).  
 * Could be some logic to estimate PPAP date based on SoP date – have to be discussed with QM.
 * @Used at: tooling project, show graphical notification for:           
 * Last update: 2023-01-25
 * ATTRIBUTRE: dtb.partsDeliveryTargetDate, dtb.toolingCompletionTargetDate, dtb.supplierType, dtb.idEd, dtb.targetDateDrawingForED, dtb.pReleaseDate
 */

const DELIVERYTARGET = { //A++ Parts Delivery Target Date
    TYPE: '',
    ATTR: {
        partsDeliveryTargetDate: 'dtb.partsDeliveryTargetDate',
    },
};


const SUPPTYPE = { //B++ Supplier Type
    TYPE: '',
    ATTR: {
        supplierType: 'dtb.supplierType',
    },
};

const TOOLINGCOMPLETE = { //C++ = A - B * 1 or 4 months -> Tooling Completion Target Date
    TYPE: '',
    ATTR: {
        toolingCompletionTargetDate: 'dtb.toolingCompletionTargetDate',
    },
};

const TOOLINGLT = { //D++ Tooling Lead Time
    TYPE: '',
    ATTR: {
        plannedToolingLeadTime: 'dtb.plannedToolingLeadTime',
    },
};

const TOOLINGKICKOFF = { //E++ = C - D -> Tooling Kick-off Date
    TYPE: '',
    ATTR: {
        toolingKickOffDate: 'dtb.toolingKickOffDate',
    },
};

const TTSCREATION = { //F++ = D - 2 months -> Tooling Creation Date
    TYPE: '',
    ATTR: {
        ttsCreationDate: 'dtb.targetTTSCreation',
    },
};

const IDED = { //G++ if ED -> needs to go for supplier drawing, else no need
    TYPE: '',
    ATTR: {
        idEd: 'dtb.idEd',
    },
};

const SUPPDRAWING = { //H++ = F - 0.5 months -> for ED: Target Date for Supplier Drawing
    TYPE: '',
    ATTR: {
        suppDrawingTargetDate: 'dtb.targetDateDrawingForED',
    },
};

const PRELEASE = { //I++ = F - 1.5 months -> for ED; F - 2.5 months -> for ID 
    TYPE: '',
    ATTR: {
        pReleaseTargetDate: 'dtb.pReleaseDate',
    },
};

/* Budget Consumption date logic: 
 * hotai -> parts target date;  
 * ippan/ oversea -> PPAP/ISIR date
 */

const IPPANHOTAIOVERSEA = { //J++
    TYPE: '',
    ATTR: {
        ippanHotaiOverseas: 'dtb.ippanHotaiOverseas',
    },
};

const PPAPISIR = { //K++ PPAP/ISIR date from QM or LCM
    TYPE: '',
    ATTR: {
        ppapISIRDate: 'dtb.ppapISIR',
    },
};

const BUDGETCONSUMPTION = { //L++ this is a text field, NOT a DATE 🤦‍♂️😢
    TYPE: '',
    ATTR: {
        budgetConsumptionDate: 'dtb.budgetConsumptionDate',
    },
};

//==================================================================AJ+ Quater Testing Function -START
function getQuarter(date = new Date()) {
    cplace.log("AJ: date=" + date); //testing AJ
    return Math.floor(date.getMonth() / 3 + 1);
  }
  
  cplace.log(getQuarter()); // 👉️ current quarter ✅
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-01-24'))); // 👉️ 1
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-02-24'))); // 👉️ 1
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-03-24'))); // 👉️ 1
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-04-24'))); // 👉️ 2
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-05-24'))); // 👉️ 2
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-06-24'))); // 👉️ 2
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-07-24'))); // 👉️ 3
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-08-24'))); // 👉️ 3
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-09-24'))); // 👉️ 3
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-10-24'))); // 👉️ 4
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-11-24'))); // 👉️ 4
  cplace.log("AJ: testing quarter=" + getQuarter(new Date('2023-12-24'))); // 👉️ 4
  //==================================================================AJ+ Quater Testing Function -END

var monthMS = 2592000000;
var page = changeEvent.getEntity();
var deliveryTargetDate = page.get(DELIVERYTARGET.ATTR.partsDeliveryTargetDate); //A++
var supplierType = page.get(SUPPTYPE.ATTR.supplierType); //B++
var duration;

cplace.log("AJ: deliveryTargetDate = " + deliveryTargetDate);
let deliveryTargetDateD = new Date(deliveryTargetDate);
var tStampTargetDelivery = deliveryTargetDateD.getTime();

cplace.log("AJ: time stamp for target delivery=" + tStampTargetDelivery); //AJ++
cplace.log("AJ: supplierType=" + supplierType);

if(supplierType === "Domestic") {
    duration = 1 * monthMS;
} else {
    duration = 4 * monthMS;
}

cplace.log("AJ: duration=" + duration);

var tStampCompletionTarget = tStampTargetDelivery - duration;
cplace.log("AJ: tStampCompletionTarget=" + tStampCompletionTarget);
//============================================================================================================ABC

//Step1: get the month and calculate in MS
var plannedToolingLeadTime = page.get(TOOLINGLT.ATTR.plannedToolingLeadTime);
cplace.log("AJ: toolingLeadTime = " + plannedToolingLeadTime);
if(plannedToolingLeadTime != 0) {
    cplace.log("AJ: tooling leadtime is not null"); //testing by AJ++
    var tStampToolingLT = plannedToolingLeadTime * monthMS; //B
    cplace.log("AJ: tStampToolingLT=" + tStampToolingLT);
    //Step3: 
    var tStampToolingKickOff = tStampCompletionTarget - tStampToolingLT; //this is MS
    cplace.log("AJ: tStampToolingKickOff= " + tStampToolingKickOff); //Tooling Kick-off
    //Step4:
    var tStampTTSCreation = tStampToolingKickOff - 2 * monthMS;
    cplace.log("AJ: tStampTTSCreation= " + tStampTTSCreation); //Tooling TTS Creation
    //Ippan, Hotai, Oversea
    var ippanHotaiOver = page.get(IPPANHOTAIOVERSEA.ATTR.ippanHotaiOverseas);
    var budgetConsumptionDateQ;
    //Step5: ID/ED -> for supplier drawing
    var idEd = page.get(IDED.ATTR.idEd);
    cplace.log("AJ: idEd= " + idEd);
    if(idEd == "ED") {
        var tStampForSuppDrawing = tStampTTSCreation - 0.5 * monthMS;
        cplace.log("AJ: tStampeForSuppDrawing= " + tStampForSuppDrawing); //Supplier Drawing Target Date
        var tStampForPRelease = tStampForSuppDrawing - 1.5 * monthMS;
        cplace.log("AJ: tStampForPRelease= " + tStampForPRelease); //P Release Target Date
        var ppapISIRDate = page.get(PPAPISIR.ATTR.ppapISIRDate);
        if(ippanHotaiOver == "Hotai") {
            var quarterString = getQuarter(new Date(deliveryTargetDate));
            var yearString = new Date(deliveryTargetDate).getFullYear();
            cplace.log("AJ: yearString= " + yearString); //testing AJ++
            budgetConsumptionDateQ = "Q" + quarterString + "/" + yearString;
            cplace.log("AJ: budgetConsumptionDateQ = " + budgetConsumptionDateQ); //testing AJ
        } else {
            if(ppapISIRDate != null) {
                var quarterString = getQuarter(new Date(ppapISIRDate));
                var yearString = new Date(ppapISIRDate).getFullYear();
                cplace.log("AJ: yearString= " + yearString); //testing AJ++
                budgetConsumptionDateQ = "Q" + quarterString + "/" + yearString;
                cplace.log("AJ: budgetConsumptionDateQ = " + budgetConsumptionDateQ); //testing AJ
            }
        }
        cplace.actions().updatePage(page, {
            customAttributes: {
                'dtb.toolingCompletionTargetDate': new Date(tStampCompletionTarget), //C++
                'dtb.toolingKickOffDate': new Date(tStampToolingKickOff), //E++
                'dtb.targetTTSCreation' : new Date(tStampTTSCreation), //F++
                'dtb.targetDateDrawingForED' : new Date(tStampForSuppDrawing), //H++
                'dtb.pReleaseDate' : new Date(tStampForPRelease), //I++
                'dtb.budgetConsumptionDate' : budgetConsumptionDateQ //L++
            }
        }
        );
        page.registerAttributeForRefresh(TOOLINGCOMPLETE.ATTR.toolingCompletionTargetDate);
        page.registerAttributeForRefresh(TOOLINGKICKOFF.ATTR.toolingKickOffDate);
        page.registerAttributeForRefresh(TTSCREATION.ATTR.ttsCreationDate);
        page.registerAttributeForRefresh(SUPPDRAWING.ATTR.suppDrawingTargetDate);
        page.registerAttributeForRefresh(PRELEASE.ATTR.pReleaseTargetDate);
        page.registerAttributeForRefresh(BUDGETCONSUMPTION.ATTR.budgetConsumptionDate);
    } else {
        cplace.log("AJ: ID testing")
        var tStampForPRelease = tStampTTSCreation - 2.5 * monthMS;
        cplace.actions().updatePage(page, {
            customAttributes: {
                'dtb.targetDateDrawingForED' : null, //H++
                'dtb.pReleaseDate' : new Date(tStampForPRelease) //I++
            }
        }
        );
        page.registerAttributeForRefresh(SUPPDRAWING.ATTR.suppDrawingTargetDate);
        page.registerAttributeForRefresh(PRELEASE.ATTR.pReleaseTargetDate);
    }

} else {
    cplace.log("AJ: tooling leadtime is null"); //testing by AJ++
    cplace.actions().updatePage(page, {
        customAttributes: {
            'dtb.toolingCompletionTargetDate': new Date(tStampCompletionTarget), //C++
            'dtb.toolingKickOffDate': null, //E++
            'dtb.targetTTSCreation' : null, //F++
            'dtb.targetDateDrawingForED' : null, //H++
            'dtb.pReleaseDate' : null, //I++
            'dtb.budgetConsumptionDate' : null //L++
        }
    }
    );
    page.registerAttributeForRefresh(TOOLINGCOMPLETE.ATTR.toolingCompletionTargetDate);
    page.registerAttributeForRefresh(TOOLINGKICKOFF.ATTR.toolingKickOffDate);
    page.registerAttributeForRefresh(TTSCREATION.ATTR.ttsCreationDate);
    page.registerAttributeForRefresh(SUPPDRAWING.ATTR.suppDrawingTargetDate);
    page.registerAttributeForRefresh(PRELEASE.ATTR.pReleaseTargetDate);
    page.registerAttributeForRefresh(BUDGETCONSUMPTION.ATTR.budgetConsumptionDate);
}

//pie chart widget
//whether TEnzin can access the video