// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

// Alexa SDK
const Alexa = require('ask-sdk');

// Helper functions and data
const util = require('../util.js');
const constants = require('../constants');

// home menu APL building
const mainPageBuilder = require('../handlers/mainMenu.js');

module.exports = {  
   
    /**
     * Press Event handler on the main menu page for the room service button
     */
    GeneralRoomServiceUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && Alexa.getRequest(handlerInput.requestEnvelope).arguments[0] === constants.ROOM_SERVICE_INFO;
        },
        handle(handlerInput) {
            return module.exports.GeneralRoomServiceIntentHandler.handle(handlerInput, true);  
        }
    },

    /**
     * Intent handler for room service intent.  Shows in room service dining menu.
     * Note: there is no corresponding voice menu experience for this intent.
     */
    GeneralRoomServiceIntentHandler: {
        canHandle(handlerInput) {            
            return util.parseIntent(handlerInput) === 'GeneralRoomServiceIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            
            // The skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.MENU;
            console.info(`${sessionAttributes[constants.STATE]}, GeneralRoomService`);

            let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            let speakOutput = `${requestAttributes.t('ROOMSERVICE')} `;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){   
                const template = require('../apl/inRoomDining.json');  
                let diningInfo = require('../languages/data/diningInfo.json');  

                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.DINING_PAGE_TOKEN,
                    datasources: diningInfo
                    }
                );                
            } 

            if (!buttonPressed) {
                // Since we are showing a menu, we keep session open and let the guest continue
                speakOutput = speakOutput + `${requestAttributes.t('PROMPT')}` + '.';
                responseBuilder.reprompt(repromptOutput);
                responseBuilder.withShouldEndSession(false);                    
                responseBuilder.speak(speakOutput);
            }

            return responseBuilder
                .getResponse();
        }
    },

    /**
     * Press Event handler on the main menu page for the room item request page's submit button
     */
    RoomItemSubmitUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'SUBMIT_BUTTON';
        },
        handle(handlerInput) {
            return module.exports.SubmitRequestIntentHandler.handle(handlerInput, true);      
        }
    },

    /**
     * Intent handler to handle rooom item request submission
     * Note: the room item request page is voice/touch only, so hotel guest will need to use the submit button
     */
    SubmitRequestIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'SubmitRequestIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            // Only do actual submmit from button presses, if used voice, tell customer to use the button
            if (buttonPressed) {
                sessionAttributes[constants.STATE] = constants.STATES.ROOM_ITEM_REQUEST_CONFIRM;
                console.info(`${sessionAttributes[constants.STATE]}, RoomItemRequestConfirm`);
                if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                    let template = require('../apl/requestItemConfirm.json');
                    let data = require('../languages/data/requestItemConfirmData.json');
                    let submittedItems = handlerInput.requestEnvelope.request.arguments;

                    // submitted items argument is of the format [item1, quantity1, item2, quantity2....]
                    // we are checking for at least 1 item/quantity from roomItemRequest.json
                    if (submittedItems && submittedItems.length >= 2) {
                        let index = 0;
                        data.pageData.requestItems = [];
                        for (index = 0; index < submittedItems.length; index+=2) {
                            // itemName example: "Bath_robe_count"
                            let itemName = submittedItems[index].replace('_count', '')
                            itemName = itemName.replace('_', ' ');
                            let item = {
                                name: itemName,
                                quantity: submittedItems[index+1]
                            };
                            data.pageData.requestItems.push(item);
                        }
                    }
                    else {
                        console.log("No items submitted");
                        return mainPageBuilder.build_home_page(handlerInput, true);
                    }
                    responseBuilder.addDirective({
                        type: 'Alexa.Presentation.APL.RenderDocument',
                        token: constants.REQUEST_CONFIRM_PAGE_TOKEN,
                        document: template,
                        datasources: data
                    });                
                } else {
                    // This shouldn't happen when the intent is launched by a button press but doesn't support APL.
                    console.log("SubmitRequestIntentHandler: Device has No APL support");
                }    
            } else {
                if (sessionAttributes[constants.STATE] === constants.STATES.ROOM_ITEM_REQUEST) {
                    responseBuilder.speak(requestAttributes.t('ROOMDELIVERY_SUBMIT_PROMPT'));
                } else {
                    responseBuilder.speak(requestAttributes.t('FALLBACK'));
                }
            }
            return responseBuilder
                .getResponse();
        }       
    },   

    /**
     * Intent handler for removing all items from the room item request page by voice
     */
    RemoveAllItemIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'RemoveAllItemIntent';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let repromptOutput = "";
            let speakOutput = "";

            console.info(`${sessionAttributes[constants.STATE]}, RemoveAllItemIntent`);

            if (sessionAttributes[constants.STATE] === constants.STATES.ROOM_ITEM_REQUEST) {
                repromptOutput = `${requestAttributes.t('ROOM_ITEM_REQUEST_REPROMPT')} ${requestAttributes.t('ROOM_ITEM_REQUEST_PROMPT')}`;
                speakOutput = `${requestAttributes.t('ROOMDELIVERY_RESET')} ${requestAttributes.t('ROOM_ITEM_REQUEST_PROMPT')}`;
                if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                    // customer requested to reset the room item page, simply reload room request item page
                    let template = require('../apl/roomItemRequest.json');
                    const info = require('../languages/data/roomItemRequestInfo.json');

                    responseBuilder.addDirective({
                        type: 'Alexa.Presentation.APL.RenderDocument',
                        document: template,
                        token: constants.ROOM_REQUEST_PAGE_TOKEN,
                        datasources: info
                        }
                    );
                }
            } else {
                // we got here without having entered room item request first, just error out and go back to home page
                speakOutput = `${requestAttributes.t('ERROR')} ${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
                return mainPageBuilder.build_home_page(handlerInput, false, speakOutput, true);
            }

            responseBuilder.speak(speakOutput);
            responseBuilder.reprompt(repromptOutput);
            responseBuilder.withShouldEndSession(false);                      
            return responseBuilder
                .getResponse();
        }
    },

    /**
     * Press Event handler on the main menu page for the housekeeping button
     */
    HousekeepingButtonUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.source.id === 'HOUSEKEEPING_BUTTON';
        },
        handle(handlerInput) {
            return module.exports.RoomCleaningRequestIntentHandler.handle(handlerInput, true);  
        }
    },    

     /**
     * Intent handler for RoomCleaningRequestIntent
     * This shows a confirmation page for hotel guest to request or cancel housekeeping service.
     */    
     RoomCleaningRequestIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'RoomCleaningRequestIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.info(`${sessionAttributes[constants.STATE]}, RoomCleaningRequest`);

            // set state so that YesIntent / NoIntent handlers know it came from housekpeeing intent 
            sessionAttributes[constants.STATE] = constants.STATES.HOUSEKEEPING;

            let repromptOutput = `${requestAttributes.t('CLEANING_CONFIRM')}`;
            let speakOutput = `${requestAttributes.t('CLEANING_CONFIRM')}`;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {   
                let dataSource = require('../languages/data/confirmPageData.json');
                let template = require('../apl/confirm.json'); 

                dataSource.pageData.confirmationTitleText = speakOutput;
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
                responseBuilder.speak(speakOutput);
                handlerInput.responseBuilder.withShouldEndSession(false);                        
            }

            return responseBuilder
            .getResponse();
        }
    },

    /**
     * Intent handler for RoomCleaningCancelIntentHandler
     * This request is triggered when the customer use voice to cancel housekeeping service
     */    
    RoomCleaningCancelIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'RoomCleaningCancelIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.info(`${sessionAttributes[constants.STATE]}, RoomCleaningCancel`);

            // set state so that YesIntent / NoIntent handlers know the originating skill state
            sessionAttributes[constants.STATE] = constants.STATES.HOUSEKEEPINGCANCEL;

            let repromptOutput = `${requestAttributes.t('CLEANING_CANCEL_CONFIRM')} `;
            let speakOutput = `${requestAttributes.t('CLEANING_CANCEL_CONFIRM')} `;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {   
                let dataSource = require('../languages/data/confirmPageData.json');
                let template = require('../apl/confirm.json'); 

                dataSource.pageData.confirmationTitleText = speakOutput;
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
                responseBuilder.speak(speakOutput);
                handlerInput.responseBuilder.withShouldEndSession(false);                        
            }
            
            return responseBuilder
            .getResponse();        }
    },  

    /**
     * Intent handler for InRoomFoodRequestIntent
     * This intent is originally seteup to capture actual food item ordering, as the skill example only shows the menu, we will redirect
     * the handler to do that and show the menu.
     */
    InRoomFoodRequestIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'InRoomFoodRequestIntent';
        },
        handle(handlerInput, buttonPressed) {
            return module.exports.GeneralRoomServiceIntentHandler.handle(handlerInput, buttonPressed);
        }
    },


    
     /**
     * Press Event handler on the main menu page for the room item request button
     */
     RoomDeliverableUserEventHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && Alexa.getRequest(handlerInput.requestEnvelope).arguments[0] === constants.ROOM_ITEMREQUEST_INFO;
        },
        handle(handlerInput) {
            return module.exports.RoomDeliverableRequestIntentHandler.handle(handlerInput, true);  
        }
    },

    /**
     * Intent handler for room item request page.  
     * Note that this particular intent only works on multimodal devices via visual and touch, no voice request is supported.
     */
    RoomDeliverableRequestIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'RoomDeliverableRequestIntent';
        },
        handle(handlerInput, buttonPressed) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();
            let speakOutput = `${requestAttributes.t('ROOM_ITEM_REQUEST_INSTRUCTION')} ${requestAttributes.t('ROOM_ITEM_REQUEST_PROMPT')}`;

            // The skill only uses skill state for confirmation pages, setting it to MENU for other intents
            sessionAttributes[constants.STATE] = constants.STATES.ROOM_ITEM_REQUEST;
            console.info(`${sessionAttributes[constants.STATE]}, RoomDeliverableRequest`);

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                let template = require('../apl/roomItemRequest.json');
                const info = require('../languages/data/roomItemRequestInfo.json');

                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template,
                    token: constants.ROOM_REQUEST_PAGE_TOKEN,
                    datasources: info
                    }
                );
            }

            if (!buttonPressed) {
                responseBuilder.speak(speakOutput);
            }
            return responseBuilder
                .getResponse();
        }
    }
};