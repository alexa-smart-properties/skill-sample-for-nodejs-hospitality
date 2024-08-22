// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

const Alexa = require('ask-sdk-core');
const constants = require('../constants');
const util = require('../util')

module.exports = {

    PropertyFeatureOperatingHoursIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'PropertyFeatureOperatingHoursIntent';
        },
        handle(handlerInput) {

            return module.exports.build_hotelinfo_page(handlerInput, true, util.getSlotResolution(handlerInput, 'facility_type', 'facility_type'), constants.PROPERTY_INFO_TYPE.HOURS);
        }
    },

    GeneralPropertyFeaturesIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'GeneralPropertyFeaturesIntent';
        },
        handle(handlerInput) {
            return module.exports.build_hotelinfo_page(handlerInput, true, util.getSlotResolution(handlerInput, 'facility_type', 'facility_type'), constants.PROPERTY_INFO_TYPE.FEATURES);
        }
    },

    PropertyFeatureLocationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'PropertyFeatureLocationIntent';
        },
        handle(handlerInput) {
            return module.exports.build_hotelinfo_page(handlerInput, true, util.getSlotResolution(handlerInput, 'facility_type', 'facility_type'), constants.PROPERTY_INFO_TYPE.LOCATIONS);
        }
    },

    //handle the user event action from other APL pages to amenity APL page
    AmenityHomeHandler: {
        canHandle(handlerInput) {            
            if (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent') {                
                return ((Alexa.getRequest(handlerInput.requestEnvelope).arguments[0] === constants.AMENITY_MAIN)
                    || (Alexa.getRequest(handlerInput.requestEnvelope).source.id === constants.RESTAURANT_CARD_USER_EVENT)
                    || (Alexa.getRequest(handlerInput.requestEnvelope).source.id === constants.SPA_CARD_USER_EVENT)
                    || (Alexa.getRequest(handlerInput.requestEnvelope).source.id === constants.BAR_CARD_USER_EVENT)
                    || (Alexa.getRequest(handlerInput.requestEnvelope).source.id === constants.GYM_CARD_USER_EVENT))
            }
        },
        handle (handlerInput) {
            return module.exports.build_hotelinfo_page(handlerInput, false, Alexa.getRequest(handlerInput.requestEnvelope).arguments[1], "");
        },
    },

    build_hotelinfo_page(handlerInput, voice, facility_type, property_info_type) {
        const { attributesManager, responseBuilder } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        
        if (!facility_type) {
            facility_type = constants.HOTELINFO_DEFAULT;
        }

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
            let hotelInfoData = require('../languages/data/hotelInfoData.json');
            let hotelInfoAPL = require('../apl/hotelinfo.json'); 
            let i = 0;

            // if facility type is specified, scroll the sequence to the correct item index when document is loaded
            if (facility_type) {
                // find the index of the facility type in the sequence data
                for (i = 0; i < hotelInfoData.pageData.hotelInfoListData.listInfo.length; i ++) {
                    if  (hotelInfoData.pageData.hotelInfoListData.listInfo[i].primaryText.toLowerCase().replace(' ', '') === facility_type) {
                        break;
                    }
                }

                // scroll to the list item when the document is displayed
                hotelInfoAPL.onMount = [ 
                    {
                        "type": "ScrollToIndex",
                        "componentId": "alexaListView",
                        "index": i,
                        "align": "first"            
                    },
                    {
                        "type": "SetPage",
                        "componentId": "detailsPager",
                        "position": "absolute",
                        "value": i
                    }                    
                ]
            } 

            responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: constants.HOTELINFO_PAGE_TOKEN,
                document: hotelInfoAPL,
                datasources: hotelInfoData
            });

        }

        responseBuilder.shouldEndSession = false;
        if (voice) {
            let sessionAttributes = attributesManager.getSessionAttributes();
            console.info(`${sessionAttributes[constants.STATE]}, ${property_info_type}`);
            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('ERROR')} `;
            let featurePrompt = requestAttributes.t(`${property_info_type}.${facility_type.toUpperCase()}`) + " " + requestAttributes.t('PROMPT');

            speakOutput = featurePrompt ? `${featurePrompt} ` : speakOutput;

            return responseBuilder.reprompt(repromptOutput).speak(speakOutput).getResponse(); 
        }
        else {
            return responseBuilder.getResponse();
        }
    },   
    
    /**
     * Intent handler for welcome message intent handler
     * This intent is triggered by either voice, or skill connection task, and will play a short welcome message/video.
     * After video playback is completed there is a separate handler that will launch the hotel menu.
     */
    WelcomeMessageIntentHandler: {
        canHandle(handlerInput) {            
            return util.parseIntent(handlerInput) === 'WelcomeMessageIntent';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            
            // The skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, WelcomeMessage`);

            let speakOutput = `${requestAttributes.t('WELCOME_MSG')} `;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('../apl/videoPage.json');  
                let data = require('../languages/data/welcomePageInfo.json');     

                data.pageData.properties.skillResponseOutput = "<speak>" + speakOutput + "</speak>";             
                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: constants.WELCOME_PAGE_TOKEN,
                    document: template,
                    datasources: data
                });                
            } 
            return responseBuilder
                .getResponse();
        }
    },

    /**
     * Intent handler for HotelInformationIntent
     * This returns information about hotel, e.g. hotel address, room number, telephone number etc. 
     */    
    HotelInformationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'HotelInformationIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            // The skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, HotelInformation`);

            let hotelInfoSpeech  = util.getSlotResolution(handlerInput, 'hotel_information', 'hotel_information');
            let hotelInfoSlot = hotelInfoSpeech.replace(' ', '_');

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = "The hotel " + hotelInfoSpeech + " is " + constants.HOTEL_INFO[hotelInfoSlot];

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('../apl/textInfoOnly.json');  
                let textInfo = require('../languages/data/textInfoContent.json');  
                let displayInfo = constants.HOTEL_INFO['hotel_info_display_text'];
                
                textInfo.pageData["textContent"] = displayInfo;
                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.HOTELINFO_PAGE_TOKEN,
                    datasources: textInfo
                    }
                );                
            } 

            if (!buttonPressed) {
                // if navigated here via NFI, close session, no question as a followup after response
                if (!Alexa.isNewSession(handlerInput.requestEnvelope)) {
                    speakOutput = speakOutput + ` ${requestAttributes.t('PROMPT')}`;
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
     * Press Event handler on the main menu page for the wifi info
     */
    WifiUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && Alexa.getRequest(handlerInput.requestEnvelope).arguments[0] === constants.WIFIINFO;
        },
        handle(handlerInput) {
            return module.exports.WifiAccessFreeIntentHandler.handle(handlerInput, true);  
        }
    },

    /**
     * Intent handler for Wifi info intents
     */    
    WifiAccessFreeIntentHandler: {
        canHandle(handlerInput) {
             return ['WifiAccessFreeIntent','WifiAccessQAIntent'].includes(util.parseIntent(handlerInput));                            
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            // The skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, WifiAccessFree`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('WIFI')} `;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('../apl/twoPanelPage.json');         
                let data = require('../languages/data/wifiPageData.json');

                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.WIFI_PAGE_TOKEN,
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
    },

    /**
     * Intent handler for AmenityInformationIntent
     * This returns the features / amenities provided by the hotel.
     */    
    AmenityInformationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'AmenityInformationIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            // The skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, AmenityInformation`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('AMENITIES')} `;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('../apl/textInfoOnly.json');  
                let textInfo = require('../languages/data/textInfoContent.json');  

                textInfo.pageData["textContent"] = speakOutput;
                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: constants.AMENITY_PAGE_TOKEN,
                    document: template,
                    datasources: textInfo
                    }
                );                
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
}
