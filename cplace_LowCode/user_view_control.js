/*
Author: Xiang.lou@daimler.com
Date: 23.10.2022

low-code 
- type: P-BOM D-sample
- location: P-BOM D-sample, default layout

Function description:
if the role is "project admin", it shows the layout set A
if the role is NOT "project admin", then it is the normal user and shows the layout set B
*/


const D_SAMPLE = {
    TYPE: '',
    ATTR: {
        PARENT: 'dtb.parent',
    },
};

const PBOM_D_SAMPLE = {
    TYPE: '',
    ATTR: {
        PARENT: 'dtb.parent',
    },
};

const PARTS_TRACKING_LIST = {
    TYPE: '',
    ATTR: {
        PARENT: 'dtb.parentproject',
    },
};

const PROJECT = {
    TYPE: '',
    ATTR: {
        PROJECT_ADMIN: 'dtb.projectAdministrator',
    },
};



// Get name of current user

var user = cplace.utils().getCurrentUser();
var project = page.getOptional(PBOM_D_SAMPLE.ATTR.PARENT).getOptional(D_SAMPLE.ATTR.PARENT).getOptional(PARTS_TRACKING_LIST.ATTR.PARENT)
var projectAdminGroup = project.getOptional(PROJECT.ATTR.PROJECT_ADMIN)

cplace.log(project)
cplace.log(projectAdminGroup)

// this case should not happen
if (projectAdminGroup == null) {
    var layoutConfig = {
        layouts: ['',],
        active: ''
    };
}

else {
    // user is the member in projectAdmin, layout set A
    if (user.isMemberOf(projectAdminGroup) == true) {
        var layoutConfig = {
            layouts: ['dtb.pBomDSample.layout.overview', 'dtb.pBomDSample.layout.toBeReviewed', 'dtb.pBomDSample.layout.allData', 'dtb.pBomDSample.layout.diagram'],
            active: 'dtb.pBomDSample.layout.overview',
        };
    }
    // user is NOT the member in projectAdmin, layout set B
    else if (user.isMemberOf(projectAdminGroup) == false) {
        var layoutConfig = {
            layouts: ['dtb.pBomDSample.layout.rd', 'dtb.pBomDSample.layout.procurement',],
            active: 'dtb.pBomDSample.layout.rd',
        };
    };

} // end of else




return layoutConfig;