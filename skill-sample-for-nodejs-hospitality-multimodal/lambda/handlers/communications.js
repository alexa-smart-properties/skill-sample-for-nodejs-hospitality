// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

// Alexa SDK
const Alexa = require('ask-sdk');

// Helper functions and data
const util = require('../util.js');
const constants = require('../constants');

module.exports = {

    /**
     * Handler for the AMAZON.Authorization.Grant request, required so PBX calls can be initiated from within
     * a custom skill.  When a skill is enabled in an ASP room unit, Alexa will send an 'Alexa.Authorization.Grant'
     * request, if the skill handles it, then the calling permission is granted for the unit.
     */
    AuthorizationGrantRequestHandler: {
        canHandle(handlerInput) {
            return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Authorization.Grant');
        },
        async handle() {
            return {
                "event": {
                    "header": {
                        "messageId": `abc-123-def-456-${Date.now()}`,
                        "namespace": "Alexa.Authorization",
                        "name": "AcceptGrant.Response",
                        "payloadVersion": "3"
                    },
                    "payload": {
                    }
                }
            }
        }
    },  

    /**
     * Press Event handler for the phone directory button on the home menu page
     */
    DirectoryButtonUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'DIRECTORY_BUTTON';
        },
        handle(handlerInput) {
            return module.exports.PhoneDirectoryIntentIntentHandler.handle(handlerInput, true);  
        }
    },

    /**
     * Intent handler for PhoneDirectoryIntent
     * This intent show the phone directory UI for the guest 
     */    
    PhoneDirectoryIntentIntentHandler: {
        canHandle(handlerInput) {
            return ['PhoneDirectoryIntent'].includes(util.parseIntent(handlerInput));            
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let hotelDepartment = "";
            let speakOut = '';
            let repromptOutput = '';

            // set state so that YesIntent / NoIntent handlers know it came from Phone Directory intent 
            sessionAttributes[constants.STATE] = constants.STATES.PBX;

            speakOut = requestAttributes.t('DIRECTORY_INSTRUCTION');
            if (!buttonPressed) {
                hotelDepartment = util.getSlotResolution(handlerInput, 'hotel_department_name', 'hotel_department');
            }
            repromptOutput = speakOut;
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {   
                let template = require('../apl/phoneDirectory.json'); 
                let dataSource = require('../languages/data/phoneDirectoryData.json');
        
                // if a department is specified, and it is in the list of supported department, then 
                // scroll the list to the correct index in after the page is loaded (onMount)
                if (hotelDepartment) {
                    let index = -1;
                    let key = hotelDepartment.toLowerCase().replaceAll(' ', '');
                    index = dataSource.pageData.items.findIndex(p => p.name.toLowerCase().replaceAll(' ', '').includes(key));
                    if (index >= 0) {
                        template.onMount = {
                            "type": "ScrollToIndex",
                            "componentId": "directoryList",
                            "index": index,
                            "align": "first"            
                        }
                    }
                }
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.DIRECTORY_PAGE_TOKEN,
                    datasources: dataSource
                    }
                );            
            }

            if (!buttonPressed) {
                // since we are showing a phone directory, don't exit the session to let guest have a chance
                // to look around even if NFI is used
                speakOut = speakOut + ` ${requestAttributes.t('PROMPT')}`;
                responseBuilder.reprompt(repromptOutput);
                responseBuilder.withShouldEndSession(false);                    
                responseBuilder.speak(speakOut);
            }

            return handlerInput.responseBuilder
                .getResponse();
        }
    },

    /**
     * Press Event handler for the call button in the phone directory page
     */
    CallButtonUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'CALL_BUTTON';
        },
        handle(handlerInput) {
            const departmentName = handlerInput.requestEnvelope.request.arguments[0];
            const departmentNumber = handlerInput.requestEnvelope.request.arguments[1];
            return module.exports.PBXCallRequestIntentHandler.handle(handlerInput, true, departmentName, departmentNumber);  
        }
    },
    
    /**
     * Intent handler for MaintenanceIntent and CallDepartmentIntent
     * Depend on the specified department, make a PBX call with the right PBX extension from the skill
     * Shows a confirm page to let hotel guest decide if they want to call the department or not
     */    
    PBXCallRequestIntentHandler: {
        canHandle(handlerInput) {
            return ['MaintenanceIntent','CallDepartmentIntent'].includes(util.parseIntent(handlerInput));            
        },
        handle(handlerInput, buttonPressed, departmentName, departmentNumber) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let hotelDepartment = "the hotel department";
            const intentName = util.parseIntent(handlerInput);

            if (intentName === 'MaintenanceIntent') {
                hotelDepartment = 'hotel maintenance';
            } else if (intentName === 'CallDepartmentIntent') {
                hotelDepartment = util.getSlotResolution(handlerInput, 'hotel_department_name', 'hotel_department');
            } else if (departmentName) {
                hotelDepartment = departmentName;
            }
            let speakOut = '';
            let repromptOutput = '';

            // set state so that YesIntent / NoIntent handlers know it came from PBX intent 
            sessionAttributes[constants.STATE] = constants.STATES.PBX;

            speakOut = requestAttributes.t('CALLING_CONFIRMATION_PREFIX');
            if (!hotelDepartment) {
                hotelDepartment = requestAttributes.t('CALLING_HOTELDEPARTMENT');
            }
            speakOut = speakOut + hotelDepartment + '?';
            repromptOutput = speakOut;
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {   
                let dataSource = require('../languages/data/confirmPageData.json');
                let template = require('../apl/confirm.json'); 

                
                dataSource.pageData.confirmationTitleText = speakOut;
                if (departmentName) {
                    dataSource.pageData.departmentName = departmentName;
                }
                if (departmentNumber) {
                    dataSource.pageData.departmentNumber = departmentNumber;
                }
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.CONFIRM_PAGE_TOKEN,
                    datasources: dataSource
                    }
                );            
            }
            if (!buttonPressed) {
                responseBuilder.reprompt(repromptOutput);    
                responseBuilder.speak(speakOut);
                handlerInput.responseBuilder.withShouldEndSession(false);                        
            }
            return handlerInput.responseBuilder
                .getResponse();
        }
    }
};