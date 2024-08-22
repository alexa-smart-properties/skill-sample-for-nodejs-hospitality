// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

// Alexa SDK
const Alexa = require('ask-sdk');

// Helper functions and data
const util = require('../util.js');
const constants = require('../constants');

// For AWS Pinpoint
const sms = require('../sms.js');
const config = require('../config.js');

// home menu APL building
const mainPageBuilder = require('../handlers/mainMenu.js');

module.exports = {  
   
    /**
     * Intent handler for CheckoutTimeIntent
     * This returns the time that the hotel guest should check out at as a response
     */    
    CheckoutTimeIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'CheckoutTimeIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            // The skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, CheckoutTime`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('CHECKOUT')} `;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('../apl/textInfoOnly.json');  
                let textInfo = require('../languages/data/textInfoContent.json');  

                textInfo.pageData["textContent"] = speakOutput;
                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.CHECKOUTTIME_PAGE_TOKEN,
                    datasources: textInfo
                    }
                );                
            } 

            if (!buttonPressed) {
                // if navigated here via NFI, close session, no question as a followup after response
                if (!Alexa.isNewSession(handlerInput.requestEnvelope)) {
                    responseBuilder.reprompt(repromptOutput);
                    responseBuilder.withShouldEndSession(false);                    
                }
                else {
                    responseBuilder.withShouldEndSession(true);                    
                }
                responseBuilder.speak(speakOutput);
            }

            return responseBuilder
                .getResponse();
        }
    },

    /**
     * Press Event handler for the checkout button on the home menu page
     */
    CheckoutUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && Alexa.getRequest(handlerInput.requestEnvelope).arguments[0] === constants.ROOM_CHECKOUT_INFO;
        },
        handle(handlerInput) {
            return module.exports.CheckoutRequestIntentHandler.handle(handlerInput, true);  
        }
    },

    /**
     * Intent handler for CheckoutRequestIntent
     * This renders the checkout confirmation page and ask hotel guest to confirm checkout
     */    
    CheckoutRequestIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'CheckoutRequestIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let repromptOutput = "";
            let speakOutput = "";

            // set the skill state to checkout, so Yes/NoIntent handler knows the skill state
            console.info(`${sessionAttributes[constants.STATE]}, CheckoutRequest`);
            sessionAttributes[constants.STATE] = constants.STATES.CHECKOUT;

            repromptOutput = `${requestAttributes.t('CHECKOUT_CONFIRMMSG')}`;
            speakOutput = `${requestAttributes.t('CHECKOUT_CONFIRMMSG')} `;
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let data = require('../languages/data/checkoutConfirmData.json');          
                let template = require('../apl/checkout.json');      

                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: constants.CHECKEDOUT_PAGE_TOKEN,
                    document: template,
                    datasources: data
                });
            }
            if (!buttonPressed) {
                // Since user is checking out, we have to keep session open no mater whether it is NFI launched or not
                // so we can get a confirmation from the hotel guest for checkout
                responseBuilder.reprompt(repromptOutput);
                responseBuilder.speak(speakOutput);
                responseBuilder.withShouldEndSession(false);                                                        
            }
            return responseBuilder
            .getResponse();
        }
    },     


     /**
     * Press Event handler for the confirm button on checkout confirmation page
     */
     CheckoutConfirmUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'CHECKOUT_YES_BUTTON';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();

            let speakOutput = `${requestAttributes.t('CHECKOUT_CONFIRM')} `;

            // send checkout message to the two demo phones
            sms.SendSMSMessage(`${requestAttributes.t('CHECKOUT_CONFIRMSMS')} `, config.GUEST_NUMBER);

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('../apl/headline.json'); 
                const data = require('../languages/data/checkedoutConfirmData.json');

                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template.document,
                    token: constants.CHECKOUT_PAGE_TOKEN,
                    datasources: data
                });
            }
            responseBuilder.withShouldEndSession(true);
            return responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    },

    /**
     * Press Event handler for the cancel button on checkout confirmation page
     */
    CheckoutCancelUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'CHECKOUT_NO_BUTTON';
        },
        handle(handlerInput) {
            const { attributesManager } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();

            let speakOutput = `${requestAttributes.t('CHECKOUT_CANCEL')} `;
            return mainPageBuilder.build_home_page(handlerInput, true, speakOutput);
        }
    },

    /**
     * Intent handler for BillingInformationIntentHandler
     * returns the customer's current billing information via voice and screen
     */
    BillingInformationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'BillingInformationIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            // The skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, BillingInformation`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('BILLING')} `;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                const data = require('../languages/data/currentBillData.json');
                const template = require('../apl/currentbill.json');         
                
                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.BILL_PAGE_TOKEN,
                    datasources: data
                });                
            } 

            if (!buttonPressed) {
                // if navigated here via NFI, close session, no question as a followup after response
                if (!Alexa.isNewSession(handlerInput.requestEnvelope)) {
                    speakOutput = speakOutput + `${requestAttributes.t('PROMPT')}` + '.';
                    responseBuilder.reprompt(repromptOutput);
                    responseBuilder.withShouldEndSession(false);                    
                }
                else {
                    responseBuilder.withShouldEndSession(true);                    
                }
                responseBuilder.speak(speakOutput);
            }
            return responseBuilder
                .getResponse();
        }
    }
};
        
        
        
        
        
        
        
