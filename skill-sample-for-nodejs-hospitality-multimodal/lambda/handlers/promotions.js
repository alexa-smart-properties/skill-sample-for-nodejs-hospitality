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
     * Press Event handler on the main menu page for loyalty program promotion
     */
    LoyaltyProgramUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && Alexa.getRequest(handlerInput.requestEnvelope).source.id === constants.LOYALTY_PROGRAM_CARD_USER_EVENT;
        },
        handle(handlerInput) {
            return module.exports.LoyaltyProgramIntentHandler.handle(handlerInput, true);  
        }
    },

    /**
     * Intent handler for hotel loyalty program promotion 
     */
    LoyaltyProgramIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'LoyaltyProgramIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            // the skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, LoyaltyProgram`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('LOYTALTYPROGRAM')} `;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('../apl/twoPanelPage.json');  
                let data = require('../languages/data/loyaltyPageData.json');  

                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.LOYALTY_PAGE_TOKEN,
                    datasources: data
                    }
                );                
            } 

             if (!buttonPressed) {
                // this intent shows a QR code, we won't close session even if it is launched by NFI
                speakOutput = speakOutput + `${requestAttributes.t('PROMPT')}`;
                responseBuilder.reprompt(repromptOutput);
                responseBuilder.withShouldEndSession(false);                    
                responseBuilder.speak(speakOutput);
            }

            return responseBuilder
                .getResponse();
        }
    },

    /**
     * Press Event handler on the main menu page for tour promotion
     */
    TourAndActivityUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && Alexa.getRequest(handlerInput.requestEnvelope).source.id === constants.TOUR_CARD_USER_EVENT;
        },
        handle(handlerInput) {
            return module.exports.TourAndActivityIntentHandler.handle(handlerInput, true);  
        }
    },

    /**
     * Intent handler to present a tour upsell experience
     */
    TourAndActivityIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'TourAndActivityIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            // the skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, TourAndActivity`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('TOUR_DETAILS')} `;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('../apl/twoPanelPage.json');  
                let data = require('../languages/data/tourPageData.json'); 

                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.TOUR_PAGE_TOKEN,
                    datasources: data
                    }
                );                
            } 

             if (!buttonPressed) {
                // this intent shows a QR code, we won't close session even if it is launched by NFI
                speakOutput = speakOutput + `${requestAttributes.t('PROMPT')}`;
                responseBuilder.reprompt(repromptOutput);
                responseBuilder.withShouldEndSession(false);                    
                responseBuilder.speak(speakOutput);
            }

            return responseBuilder
                .getResponse();
        }
    },

     
    /**
     * Press Event handler on the main menu page for events promotion
     */
    NearByEventUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && Alexa.getRequest(handlerInput.requestEnvelope).source.id === constants.EVENT_CARD_USER_EVENT;
        },
        handle(handlerInput) {
            return module.exports.NearByEventIntentHandler.handle(handlerInput, true);  
        }
    },

    /**
     * Intent handler to present an event upsell experience
     */
    NearByEventIntentHandler: {
        canHandle(handlerInput) {            
            return util.parseIntent(handlerInput) === 'NearByEventIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let speakOutput = `${requestAttributes.t('EVENT_DETAILS')} `;
            
            // the skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, NearByEventIntent`);

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('../apl/videoPage.json');  
                let data = require('../languages/data/eventPageInfo.json');  

                data.pageData.properties.skillResponseOutput = "<speak>" + speakOutput + "</speak>";             
                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: constants.EVENT_PAGE_TOKEN,
                    document: template,
                    datasources: data
                });      
                
                if (!buttonPressed) {
                    responseBuilder.addDirective({
                        type: 'Alexa.Presentation.APL.ExecuteCommands',
                        token: constants.EVENT_PAGE_TOKEN,
                        commands: [{
                            "type": "SpeakItem",
                            "componentId": "videoSpokenText"
                        }]
                    });
                }
            } 

            return responseBuilder
                .getResponse();
        }
    }
};