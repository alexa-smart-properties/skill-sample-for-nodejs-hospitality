// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

// Alexa SDK
const Alexa = require('ask-sdk');

// Import helper functions and data
const util = require('./util.js');
constants = require('./constants');

/**
 * Common intent handler interface to address basic intents. This interface is invoked with request from primary intent handlers to process the requests.
 * @param {*} handlerInput 
 * @param {*} intentName 
 * @param {*} outputPromptName 
 * @param {*} confirmPromptName 
 * @returns 
 */
function intentHandlerInterface(handlerInput, intentName, outputPromptName, confirmPromptName) {
    const { attributesManager, responseBuilder } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    let sessionAttributes = attributesManager.getSessionAttributes();

    console.info(`${sessionAttributes[constants.STATE]}, intentName`);

    let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
    let speakOutput = `${requestAttributes.t(outputPromptName)} `;
    
    //confirm request code - only run when variable is populated 
    if(confirmPromptName !== null) {
        if (util.getConfirmationStatus(handlerInput) === 'CONFIRMED') {
            speakOutput = `${requestAttributes.t(confirmPromptName)} `;
        }
    }

    let bEndSession = false;
    if (Alexa.isNewSession(handlerInput.requestEnvelope)) {
        bEndSession = true;
    }
    else {
        responseBuilder.reprompt(repromptOutput);
        speakOutput = speakOutput + " " + requestAttributes.t('PROMPT');
    }
    return responseBuilder
        .withShouldEndSession(bEndSession)
        .speak(speakOutput)
        .getResponse();
    
}

/**
 * Common intent handler interface to address basic intents with APL operations. This interface is invoked with request from primary intent handlers to process the requests.
 * 
 * @param {*} handlerInput 
 * @param {*} intentName 
 * @param {*} outputPromptName 
 * @param {*} aplPromptName 
 * @returns 
 */
function intentHandlerInterfaceWithAPL(handlerInput, intentName, outputPromptName, aplPromptName, confirmPromptName) {
    const { attributesManager, responseBuilder } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    let sessionAttributes = attributesManager.getSessionAttributes();

    console.info(`${sessionAttributes[constants.STATE]}, intentName`);

    let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
    let speakOutput = `${requestAttributes.t(outputPromptName)} `;

    //confirm request code - only run when variable is populated 
    if(confirmPromptName !== null) {
        if (util.getConfirmationStatus(handlerInput) === 'CONFIRMED') {
            speakOutput = `${requestAttributes.t(confirmPromptName)} `;
        }
    }

    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
        let template = require('./apl/headline.json');         
    
        // Add the RenderDocument directive to the response
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: template.document,
            datasources: {
                "headlineTemplateData": {
                    "backgroundImage": constants.IMAGES.LOBBY,
                    "text": `${requestAttributes.t(aplPromptName)} `,
                    "sub": " ",
                    "logoUrl": constants.IMAGES.LOGO,
                    "hintText": "Try, \"Alexa, where is the concierge?\""
                }
            }
        });
        
    } 

    if (!Alexa.isNewSession(handlerInput.requestEnvelope)) {
        speakOutput = speakOutput+ `${requestAttributes.t('PROMPT')}`;
        responseBuilder.reprompt(repromptOutput);
    }    
    return responseBuilder
    .withShouldEndSession(Alexa.isNewSession(handlerInput.requestEnvelope))
    .speak(speakOutput)
    .getResponse();
}


module.exports = {
    /**
     * Handler for General room service requests
     */
    GeneralRoomServiceIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'GeneralRoomServiceIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'GeneralRoomServiceIntent', 'ROOMSERVICE', null);
        }
    },

    /**
     * Handler for room delivery intents requests
     */
    RoomDeliverableRequestIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'RoomDeliverableRequestIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'RoomDeliverableRequestIntent', 'ROOMDELIVERY_CANCEL', 'ROOMDELIVERY');
        }
    },

    /**
     * Handler for in-room food service requests
     */
    InRoomFoodRequestIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'InRoomFoodRequestIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'InRoomFoodRequestIntent', 'FOODDELIVERY_CANCEL','FOODDELIVERY');
        }
    },

    /**
     * Handler for billing related requests
     */
    BillingInformationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'BillingInformationIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'BillingInformationIntent', 'BILLING', null);
        }
    },

    /**
     * Handler for cancel room cleaning service requests
     */
    RoomCleaningCancelIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'RoomCleaningCancelIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'RoomCleaningCancelIntent', 'CLEANING_CANCELABORT', 'CLEANING_CANCEL');
        }
    },

    /**
     * Handler for cancel room cleaning service requests
     */
    RoomCleaningRequestIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'RoomCleaningRequestIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'RoomCleaningRequestIntent', 'CLEANING_CANCEL', 'CLEANING_REQUEST');
        }
    },

    /**
     * Handler for wifi service requests
     */
    WifiAccessFreeIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'WifiAccessFreeIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'WifiAccessFreeIntent', 'WIFI', null);
        }
    },

    /**
     * Handler for wifi realted question and answer requests
     */
    WifiAccessQAIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'WifiAccessQAIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'WifiAccessQAIntent', 'WIFI_PASSWORD', null);
        }
    },

    /**
     * Handler for amenities service requests which should be pulled from the in house property database
     */
    AmenityInformationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'AmenityInformationIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'AmenityInformationIntent', 'AMENITIES', null);
        }
    },

    /**
     * Handler for checkout service requests which should be pulled from the in house property database
     */
    CheckoutRequestIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'CheckoutRequestIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterface(handlerInput, 'CheckoutRequestIntent', 'CHECKOUT_CANCEL', 'CHECKOUT_REQUEST', 'CHECKOUT_CONFIRM');
        }
    },

    /**
     * Handler for checkout service requests which should be pulled from the in house property database
     */
    CheckoutTimeIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'CheckoutTimeIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterfaceWithAPL(handlerInput, 'CheckoutTimeIntent', 'CHECKOUT', 'CHECKOUT_TIME');
        }
    },

    /**
     * Handler for amenities service requests which should be pulled from the in house property database and can be customised
     */
    HotelInformationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'HotelInformationIntent';
        },
        handle(handlerInput) {
            return intentHandlerInterfaceWithAPL(handlerInput, 'HotelInformationIntent', 'LOCATION', null);
        }
    },

    /**
     * Handler for property related requests which should be pulled from the in-house property database
     */
    GeneralPropertyFeaturesIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'GeneralPropertyFeaturesIntent';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.info(`${sessionAttributes[constants.STATE]}, GeneralPropertyFeaturesIntent`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('ERROR')} `;
    
            let featureName = util.getSlotResolution(handlerInput, 'facility_type');
            let featurePrompt = requestAttributes.t(`PROPERTYFEATURES.${featureName.toUpperCase()}`);

            speakOutput = featurePrompt ? `${featurePrompt} ` : speakOutput;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('./apl/headline.json'); 
                let details = constants.FEATURES[featureName];
            
                // Add the RenderDocument directive to the response
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template.document,
                    datasources: {
                        "headlineTemplateData": {
                            "backgroundImage": details.image,
                            "text": details.text,
                            "sub": details.hours,
                            "logoUrl": constants.IMAGES.LOGO,
                            "hintText": details.hintText
                        }
                    }
                });
                
            } 
    
            if (!Alexa.isNewSession(handlerInput.requestEnvelope)) {
                speakOutput = speakOutput+ `${requestAttributes.t('PROMPT')}`;
                responseBuilder.reprompt(repromptOutput);
            }    
            return responseBuilder
            .withShouldEndSession(Alexa.isNewSession(handlerInput.requestEnvelope))
            .speak(speakOutput)
            .getResponse();
        }
    },
    
    /**
     * Handler for property features service requests which should be pulled from the in house property database
     */
    PropertyFeatureLocationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'PropertyFeatureLocationIntent';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.info(`${sessionAttributes[constants.STATE]}, PropertyFeatureLocationIntent`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('ERROR')} `;
    
            let featureName = util.getSlotResolution(handlerInput, 'facility_type');
            let featurePrompt = requestAttributes.t(`PROPERTYLOCATIONS.${featureName.toUpperCase()}`);

            speakOutput = featurePrompt ? `${featurePrompt} ` : speakOutput;


            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('./apl/headline.json'); 
                let details = constants.FEATURES[featureName];
            
                // Add the RenderDocument directive to the response
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template.document,
                    datasources: {
                        "headlineTemplateData": {
                            "backgroundImage": details.image,
                            "text": details.text,
                            "sub": details.hours,
                            "logoUrl": constants.IMAGES.LOGO,
                            "hintText": details.hintText
                        }
                    }
                });
                
            } 
    
            if (!Alexa.isNewSession(handlerInput.requestEnvelope)) {
                speakOutput = speakOutput+ `${requestAttributes.t('PROMPT')}`;
                responseBuilder.reprompt(repromptOutput);
            }    
            return responseBuilder
            .withShouldEndSession(Alexa.isNewSession(handlerInput.requestEnvelope))
            .speak(speakOutput)
            .getResponse();
        }
    },
    
    /**
     * Handler for property features service requests ehich should be pulled from the in house property database
     */
    PropertyFeatureOperatingHoursIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'PropertyFeatureOperatingHoursIntent';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.info(`${sessionAttributes[constants.STATE]}, PropertyFeatureOperatingHoursIntent`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('ERROR')} `;
    
            let featureName = util.getSlotResolution(handlerInput, 'facility_type');
            let featurePrompt = requestAttributes.t(`PROPERTYHOURS.${featureName.toUpperCase()}`);

            speakOutput = featurePrompt ? `${featurePrompt} ` : speakOutput;


            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('./apl/headline.json'); 
                let details = constants.FEATURES[featureName];
            
                // Add the RenderDocument directive to the response
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template.document,
                    datasources: {
                        "headlineTemplateData": {
                            "backgroundImage": details.image,
                            "text": details.text,
                            "sub": details.hours,
                            "logoUrl": constants.IMAGES.LOGO,
                            "hintText": details.hintText
                        }
                    }
                });
                
            } 
    
    
            if (!Alexa.isNewSession(handlerInput.requestEnvelope)) {
                speakOutput = speakOutput+ `${requestAttributes.t('PROMPT')}`;
                responseBuilder.reprompt(repromptOutput);
            }    
            return responseBuilder
            .withShouldEndSession(Alexa.isNewSession(handlerInput.requestEnvelope))
            .speak(speakOutput)
            .getResponse();
        }
    }
};