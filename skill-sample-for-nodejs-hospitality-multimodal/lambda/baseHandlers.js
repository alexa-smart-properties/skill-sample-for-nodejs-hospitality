// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
'use strict'

// Alexa SDK
const Alexa = require('ask-sdk');

// Helper functions and data
const mainPageBuilder = require('./handlers/mainMenu.js');
const constants = require('./constants.js');
const util = require('./util.js');
const promotionsHandlers = require('./handlers/promotions.js');
const hotelInfoHandler = require('./handlers/hotelInfoHandler.js');
const checkoutHandlers = require('./handlers/checkout.js');
const hotelServicesHandlers = require('./handlers/hotelServices.js');
const communicationsHandlers = require('./handlers/communications.js');

// PBX calling
const calling = require ('./pbx/acs_calling.js');
const config = require('./config.js');

// For AWS Pinpoint
const sms = require('./sms.js');

// Skill Connection Tasks
const skillId = 'amzn1.ask.skill.5319dfd3-6b10-4052-ad6e-e7702aea72e7'; // TODO: update this skill id to the skill id of your deployed demo skill

module.exports = {

    /**
     * LaunchRequestHandler for the skill, also handles tasks if skill is invoked through skill connection
     */
    LaunchIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'LaunchRequest';
        },
        handle (handlerInput, buttonPressed, speechOutput, noPrompt=false) {
            let task = handlerInput.requestEnvelope.request.task;
            const { attributesManager } = handlerInput;
            let sessionAttributes = attributesManager.getSessionAttributes();

            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            if (task) {
                switch (task.name) {
                    case `${skillId}.callFrontdesk`:
                        return communicationsHandlers.PBXCallRequestIntentHandler.handle(handlerInput, true, "front desk");
                    case `${skillId}.helpCollateral`:
                        return module.exports.HelpIntentHandler.handle(handlerInput, true);
                    case `${skillId}.loyaltyProgram`:
                        return promotionsHandlers.LoyaltyProgramIntentHandler.handle(handlerInput, true);;
                    case `${skillId}.nearbyEvent`:
                        return promotionsHandlers.NearByEventIntentHandler.handle(handlerInput, true);
                    case `${skillId}.tourActivity`:
                        return promotionsHandlers.TourAndActivityIntentHandler.handle(handlerInput, true); 
                    case `${skillId}.inRoomDining`:
                        return hotelServicesHandlers.InRoomFoodRequestIntentHandler.handle(handlerInput, true);
                    case `${skillId}.roomRequest`:
                        return hotelServicesHandlers.RoomDeliverableRequestIntentHandler.handle(handlerInput, true);
                    case `${skillId}.facilityInfo`: {
                        const informationTypes = ["location", "hours", "description"];
                        const typeTransform = ["PROPERTYLOCATIONS", "PROPERTYHOURS", "PROPERTYFEATURES"];
                        let index = 2;                      // index position for the default
                        let facility = "restaurant";        // default facility if nothing is specified
                        let information = "description";    // default information type

                        if (task.input) {
                            if (task.input[constants.FACILITY_TYPE]) {
                                facility = task.input[constants.FACILITY_TYPE];
                            }
                            if (task.input[constants.FACILITY_INFO_TYPE]) {
                                information = task.input[constants.FACILITY_INFO_TYPE];
                            }
                        }
                        
                        if (!constants.FEATURES[facility]) {
                            facility = constants.HOTELINFO_DEFAULT;
                        }
                        // check passed in information type argument
                        if ((index = informationTypes.indexOf(information)) < 0) {
                            information = "description";
                            index = 2;
                        }
                        return hotelInfoHandler.build_hotelinfo_page(handlerInput, false, facility, typeTransform[index]);
                    }
                    case `${skillId}.welcomeMe`:
                        return hotelInfoHandler.WelcomeMessageIntentHandler.handle(handlerInput, false);
                    case `${skillId}.wifiInfo`:
                        return hotelInfoHandler.WifiAccessFreeIntentHandler.handle(handlerInput, true);
                    case `${skillId}.houseKeeping`:
                        return hotelServicesHandlers.RoomCleaningRequestIntentHandler.handle(handlerInput, true);
                    case `${skillId}.checkOut`:
                        return checkoutHandlers.CheckoutRequestIntentHandler.handle(handlerInput, true);
                    case `${skillId}.homeMenu`:
                    default:
                        console.log("Unknown property or information type found.");
                        return mainPageBuilder.build_home_page(handlerInput, buttonPressed, speechOutput, noPrompt);
                }    
            }
            return mainPageBuilder.build_home_page(handlerInput, buttonPressed, speechOutput, noPrompt);
        } 
    },

    /**
     *  Event handler that is invoked after welcome video finishes playing
     */
    WelcomeMessageVideoOnEndEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.source.id === 'VIDEO_PLAYER';
        },
        handle(handlerInput) {
            return module.exports.LaunchIntentHandler.handle(handlerInput, false);  }
    },

    /**
     *  Button press Event handler on bottom right corner of every page to return to main menu
     */
    MainMenuUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'MENU_BUTTON';
        },
        handle(handlerInput) {
          return module.exports.LaunchIntentHandler.handle(handlerInput, true);  }
    },
      
    /**
     *  Button press Event handler on bottom right corner of every page to show the help page
     */
    HelpMenuUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'HELP_BUTTON';
        },
        handle(handlerInput) {
          return module.exports.HelpIntentHandler.handle(handlerInput, true); }
    },

    /**
     *  Button press Event handler on bottom right corner of main menu to exit the skill
     */
    ExitButtonUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'EXIT_BUTTON';
        },
        handle(handlerInput) {
          return module.exports.CancelAndStopIntentHandler.handle(handlerInput);
        }
    },

    /**
     * Central handler for the GoBackIntent.
     * We just relaunch the skill, since we only have one level, go back always go back to main menu
     */
    GobackIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'GoBackIntent';
        },
        handle(handlerInput) {
            return module.exports.LaunchIntentHandler.handle(handlerInput, false);  
        }
    },

    /**
     *  Button press Event handler for all confirmation screen confirm button
     */
    ConfirmUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'YES_BUTTON';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let speakOutput = "";

            console.info('Confirm handler, skill session state is: ' + sessionAttributes[constants.STATE]);

            // if in PBX confirmation page, start the call
            if (sessionAttributes[constants.STATE] === constants.STATES.PBX) {
                let pbxExtension = config.PBX_DEFAULT_EXTENSION;  // Default PBX extension      
                
                if (Alexa.getRequest(handlerInput.requestEnvelope).arguments[0]) {
                    pbxExtension = Alexa.getRequest(handlerInput.requestEnvelope).arguments[0];
                }
                handlerInput.responseBuilder.withShouldEndSession(true);
                speakOutput = requestAttributes.t('CALLING_STARTED');
                responseBuilder.speak(speakOutput);
                responseBuilder.withShouldEndSession(true);

                // Need to tear down the APL doc as well in addition to launch the actual call due to ACS bug
                if (handlerInput.requestEnvelope.context["Alexa.Presentation.APL"]) {
                    let existingToken = handlerInput.requestEnvelope.context["Alexa.Presentation.APL"].token;
                    responseBuilder.addDirective({
                        type: 'Alexa.Presentation.APL.ExecuteCommands',
                        token: existingToken,
                        commands: [
                          {
                            type: 'Finish'
                          }
                        ]
                    });
                }

                calling.acs_call(handlerInput, pbxExtension);
                return responseBuilder.getResponse();
            } else if (sessionAttributes[constants.STATE] === constants.STATES.HOUSEKEEPING) {
                speakOutput = `${requestAttributes.t('CLEANING_REQUEST')} `;
            } else if (sessionAttributes[constants.STATE] === constants.STATES.HOUSEKEEPINGCANCEL) {
                speakOutput = `${requestAttributes.t('CLEANING_CANCEL')} `;
            } else if (sessionAttributes[constants.STATE] === constants.STATES.ROOM_ITEM_REQUEST_CONFIRM) {
                speakOutput = `${requestAttributes.t('ROOMDELIVERY_CONFIRMED')} `;
            } else {
                console.log('ConfirmUserEventHandler: in unhandled section');                
                return module.exports.UnhandledIntentHandler.handle(handlerInput);
            } 
            return module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);  
        }
    },

    /**
     *  Button press Event handler for all confirmation screen cancel button
     */
    CancelUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'NO_BUTTON';
        },
        handle(handlerInput) {
            const { attributesManager } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let speakOutput = "";

            if (sessionAttributes[constants.STATE] === constants.STATES.PBX) {
                speakOutput = `${requestAttributes.t('CALLING_CANCELLATION')}`;
            } else if (sessionAttributes[constants.STATE] === constants.STATES.HOUSEKEEPING) {
                speakOutput = `${requestAttributes.t('CLEANING_CANCEL')} `;
            } else if (sessionAttributes[constants.STATE] === constants.STATES.HOUSEKEEPINGCANCEL) {
                speakOutput = `${requestAttributes.t('CLEANING_CANCELABORT')} `;
            } else if (sessionAttributes[constants.STATE] === constants.STATES.ROOM_ITEM_REQUEST_CONFIRM) {
                speakOutput = `${requestAttributes.t('ROOMDELIVERY_CANCEL')} `;
            } else {
                console.log('CancelUserEventHandler: in unhandled section');
                return module.exports.UnhandledIntentHandler.handle(handlerInput);
            } 
            return module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);  
        }
    },

    /**
     * Handler for the AMAZON.YesIntent. 
     */
    YesIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'AMAZON.YesIntent';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let speakOutput = "";

            if (sessionAttributes[constants.STATE] === constants.STATES.PBX) {
                let pbxExtension = config.PBX_DEFAULT_EXTENSION;  // Default PBX Extension
                if (sessionAttributes[constants.PBX_EXTENSION]) {
                    pbxExtension = sessionAttributes[constants.PBX_EXTENSION];
                }
                handlerInput.responseBuilder.withShouldEndSession(true);
                speakOutput = requestAttributes.t('CALLING_STARTED');
                responseBuilder.speak(speakOutput);
                responseBuilder.withShouldEndSession(true);

                // Need to tear down the APL doc as well in addition to launch the actual call.
                if (handlerInput.requestEnvelope.context["Alexa.Presentation.APL"]) {
                    let existingToken = handlerInput.requestEnvelope.context["Alexa.Presentation.APL"].token;
                    responseBuilder.addDirective({
                        type: 'Alexa.Presentation.APL.ExecuteCommands',
                        token: existingToken,
                        commands: [
                          {
                            type: 'Finish'
                          }
                        ]
                    });
                }

                calling.acs_call(handlerInput, pbxExtension);
                return responseBuilder.getResponse();
            } else if (sessionAttributes[constants.STATE] === constants.STATES.CHECKOUT) {
                speakOutput = `${requestAttributes.t('CHECKOUT_CONFIRM')} `;
                sms.SendSMSMessage(`${requestAttributes.t('CHECKOUT_CONFIRMSMS')} `, config.GUEST_NUMBER);

                if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                    let template = require('./apl/headline.json');      
                    const data = require('./languages/data/checkedoutConfirmData.json');
                
                    handlerInput.responseBuilder.addDirective({
                        type: 'Alexa.Presentation.APL.RenderDocument',
                        document: template.document,
                        token: constants.CHECKEDOUT_PAGE_TOKEN,
                        datasources: data
                    });
                }
                responseBuilder.withShouldEndSession(true);
                responseBuilder.speak(speakOutput);
            } else if (sessionAttributes[constants.STATE] === constants.STATES.HOUSEKEEPING) {
                speakOutput = `${requestAttributes.t('CLEANING_REQUEST')} `;
                module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);
            } else if (sessionAttributes[constants.STATE] === constants.STATES.HOUSEKEEPINGCANCEL) {
                speakOutput = `${requestAttributes.t('CLEANING_CANCEL')} `;
                module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);
            } else if (sessionAttributes[constants.STATE] === constants.STATES.ROOM_ITEM_REQUEST_CONFIRM) {                
                speakOutput = `${requestAttributes.t('ROOMDELIVERY_CONFIRMED')} `;
                module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);
            } else {
                console.log('YesIntentHandler: in unhandled section');
                return module.exports.UnhandledIntentHandler.handle(handlerInput);
            } 
            return handlerInput.responseBuilder
            .getResponse();
        }
    },

    /**
     * Handler for the AMAZON.NoIntent. 
     */
    NoIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'AMAZON.NoIntent';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let speakOutput = `${requestAttributes.t('MAIN_MENU')}`;

            if (sessionAttributes[constants.STATE] === constants.STATES.PBX) {
                speakOutput = `${requestAttributes.t('CALLING_CANCELLATION')}`;
                module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);
            } else if (sessionAttributes[constants.STATE] === constants.STATES.CHECKOUT) {
                speakOutput = `${requestAttributes.t('CHECKOUT_CANCEL')}`;
                module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);
            } else if (sessionAttributes[constants.STATE] === constants.STATES.HOUSEKEEPING) {
                speakOutput = `${requestAttributes.t('CLEANING_CANCEL')} `;
                module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);
            } else if (sessionAttributes[constants.STATE] === constants.STATES.HOUSEKEEPINGCANCEL) {
                speakOutput = `${requestAttributes.t('CLEANING_CANCELABORT')} `;
                module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);
            } else if (sessionAttributes[constants.STATE] === constants.STATES.ROOM_ITEM_REQUEST_CONFIRM) {
                speakOutput = `${requestAttributes.t('ROOMDELIVERY_CANCEL')} `;
                module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput);
            } else {
                console.log('NoIntentHandler: in unhandled section');
                return module.exports.UnhandledIntentHandler.handle(handlerInput);
            } 
            return responseBuilder.getResponse();    
        }
    },


    /**
     * Handler for the AMAZON.HelpIntent.
     */
    HelpIntentHandler: {
        canHandle(handlerInput) {
            return ['AMAZON.HelpIntent','CustomHelpIntent'].includes(util.parseIntent(handlerInput));                        
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.info(`${sessionAttributes[constants.STATE]}, AMAZON.HelpIntent`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('HELP')} ${requestAttributes.t('PROMPT')}`;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                let template = require('./apl/textInfoOnly.json');  
                let data = require('./languages/data/helpPageData.json');  

                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.HELP_PAGE_TOKEN,
                    datasources: data
                    }
                );                
            } 

            if (!buttonPressed) {
                responseBuilder.reprompt(repromptOutput);
                responseBuilder.withShouldEndSession(false);                    
                responseBuilder.speak(speakOutput);
            }

            return responseBuilder
            .getResponse();
        }
    },

    /**
     * Handler for the AMAZON.StopIntent and AMAZON.CancelIntent.
     */
    CancelAndStopIntentHandler: {
        canHandle(handlerInput) {
            return ['AMAZON.CancelIntent','AMAZON.StopIntent'].includes(util.parseIntent(handlerInput));
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.info(`${sessionAttributes[constants.STATE]}, AMAZON.StopIntent`);

            let speakOutput = requestAttributes.t('GOODBYE');

            return responseBuilder
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
        }
    },

    /**
     * Central handler for the SessionEndedRequest.
     */
    SessionEndedRequestHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'SessionEndedRequest';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            let sessionAttributes = attributesManager.getSessionAttributes();
            console.info(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

            sessionAttributes[constants.STATE] = null;
            util.saveUser(handlerInput, sessionAttributes, 'persistent');

            return responseBuilder.withShouldEndSession(true).getResponse();
        }
    },

    /**
     * Catchall handler for when there are no other handlers for the skill request.
     */
    UnhandledIntentHandler: {
        canHandle() {
            return true;
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.info (Alexa.getRequestType(handlerInput.requestEnvelope));

            console.info(`${sessionAttributes[constants.STATE]}, Unhandled`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('FALLBACK')} ${repromptOutput}`;
            if (!(handlerInput.requestEnvelope.context["Alexa.Presentation.APL"])) {    
                return module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput, true);
            }
            else {
                return responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)
                .getResponse();
            }
        }
    },

    /**
     * Error handler invoked when an error occurs during the skill execution..
     */
    ErrorHandler: {
        canHandle() {
            return true;
        },
        handle(handlerInput, error) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();

            console.error(`Error handled: ${error.speakOutput}`);
            console.error('Full error: ', error);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('ERROR')} ${repromptOutput}`;

            if (!(handlerInput.requestEnvelope.context["Alexa.Presentation.APL"])) {    
                return module.exports.LaunchIntentHandler.handle(handlerInput, false, speakOutput, true);
            }
            else {
                return responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)
                .getResponse();
            }
        }
    }
};