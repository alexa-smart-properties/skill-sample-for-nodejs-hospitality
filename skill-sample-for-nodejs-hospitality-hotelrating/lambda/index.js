// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
"use strict";

// Libary helper modules
const Alexa = require('ask-sdk-core');
const aplUtil = require("./apl.js");

// For AWS Pinpoint
const sms = require('./sms.js');
const staffSMSNumber = 'INSERT A VALID MOBILE NUMBER YOU WANT TO SEND SMS MESSAGE TO';     

// i18n library dependency, we use it below in a localization interceptor
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// i18n strings for all supported locales
const languageStrings = {
    'en-US': require('./languages/en-US.js')
};

/**
 * This request interceptor will bind a translation function 't' to the handlerInput
*/
const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings,
        });
        localizationClient.localize = function localize() {
            const args = arguments;
            const values = [];
            for (let i = 1; i < args.length; i += 1) {
                values.push(args[i]);
            }
            const value = i18n.t(args[0], {
                returnObjects: true,
                postProcess: 'sprintf',
                sprintf: values,
            });
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        requestAttributes.t = function translate(...args) {
            return localizationClient.localize(...args);
        };
    },
};

/**
 * The launch request handler handles both the skill cold launch as well as the skill connection
 * task rating. 
*/
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const { attributesManager, responseBuilder } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();

        let speakOutput = requestAttributes.t('WELCOME_PROMPT');
        let task = handlerInput.requestEnvelope.request.task;
        let rating = 3;  

        if (task) {
            switch (task.name) {
                case 'amzn1.ask.skill.8fc28a64-828a-490c-b2d3-f18c329f5509.rating':
                    rating = task.input['rating'];
                    if (rating > 5) {
                        rating = 5;
                    } else if (rating < 1) {
                        rating = 1;
                    }                  
                    return RatingIntentHandler.handle(handlerInput, rating);
                default:
                    break;
            }    
        }

        const payload = require('./data/ratingdata.json');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            let document = require('./apl/rating.json');          
            const aplDirective = aplUtil.createDirectivePayload(document, payload);

            responseBuilder.addDirective(aplDirective);
        }
    
        return responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler handles the touch event from the rating component of the hotel rating page.
*/
const RatingEventHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.source.id === 'hotelRating';
    },
    handle(handlerInput){
        const { attributesManager, responseBuilder } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();

        var speakOutput = requestAttributes.t('THANKYOU_PROMPT');
        speakOutput = getSpeechOutputByRating(handlerInput.requestEnvelope.request.arguments[1], handlerInput);
        return responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
}

/**
 * Helper function to output correct response based on the rating.
*/
function getSpeechOutputByRating(inputRating, handlerInput) {
    const { attributesManager, responseBuilder } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    var rating = parseInt(inputRating);
    var speakOutput = "";
    var txtOuptut = "";

    if(rating <= 3){
        speakOutput = requestAttributes.t('NEGATIVE_PROMPT');
        txtOuptut = requestAttributes.t('STAFF_TEXT_MESSAGE').replace('@RATING@', rating);
        handlerInput.responseBuilder.addDirective(
            aplUtil.getSadRatingAPLDirectiveBasic()
        );
        // text number should be changed so that it is a valid mobile number that can receive SMS texts        
        sms.SendSMSMessage(txtOuptut, staffSMSNumber);
    } else if (rating >= 4) {
        speakOutput = requestAttributes.t('POSITIVE_PROMPT');        
        responseBuilder.addDirective(aplUtil.getHappyRatingAPLDirectiveBasic());
    } else {
        console.log("Unexpected rating received: " + rating);
        speakOutput = requestAttributes.t('THANKYOU_PROMPT');        
    }
    return speakOutput;
}

/**
 * This intent handler is used to handle input of rating by hotel guest who choose to use voice instead of touch
*/
const RatingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RatingIntent';
    },
    handle(handlerInput, rating) {
        let ratingValue = 0;

        let speakOutput = "";
        if (rating) {
            ratingValue = rating;
        } else {
            ratingValue = handlerInput.requestEnvelope.request.intent.slots.rating.value;
        }
        speakOutput = getSpeechOutputByRating(ratingValue, handlerInput);

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // execute an APL command to change the rating value for the AlexaRating component in the document
            const aplDirective = aplUtil.setRatingPayload(ratingValue);
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

/**
 * Handler for AMAZON.HelpIntent
*/
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const { attributesManager, responseBuilder } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();    
        const speakOutput = requestAttributes.t('HELP_PROMPT');        

        return responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * Handler for AMAZON.CancelIntent and AMAZON.StopIntent
*/
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
            || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const { attributesManager, responseBuilder } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();    
        const speakOutput = requestAttributes.t('EXIT_PROMPT');        

        return responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesnt map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ignored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const { attributesManager, responseBuilder } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();    
        const speakOutput = requestAttributes.t('FALLBACK_PROMPT');        

        return responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* *
 * Handler for SessionEndedRequest, this is invoked prior to skill exiting skill session, giving the 
 * skill a chance to save state before exiting.
 */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); 
    }
};

/**
 * ErrorHandler for the skill, invoked when there is non-recoverable error from the skill handler.
*/
const ErrorHandler = {
        canHandle(handlerInput, error) {
            let { request } = handlerInput.requestEnvelope;
            console.log("ErrorHandler: checking if it can handle " +
                request.type + ": [" + error.name + "] -> " + !!error.name);
            return !!error.name;
        },
        handle(handlerInput, error) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();    
            const speakOutput = requestAttributes.t('ERROR_PROMPT');        
    
            console.log("Global.ErrorHandler: error = " + error.message);

            return responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    };

/**
 * RequestInterceptor logs the incoming request, used for debugging
*/
const RequestInterceptor = {
        process(handlerInput) {
            let { attributesManager, requestEnvelope } = handlerInput;
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.log(`==Request==${JSON.stringify(requestEnvelope)}`);
            console.log(`==SessionAttributes==${JSON.stringify(sessionAttributes, null, 2)}`);
        }
    };

/**
 * ResponseInterceptor logs the outgoing response, used for debugging
*/   
    const ResponseInterceptor = {
        process(handlerInput) {

            let { attributesManager, responseBuilder } = handlerInput;
            let response = responseBuilder.getResponse();
            let sessionAttributes = attributesManager.getSessionAttributes();

            // Log the response for debugging purposes.
            console.log(`==Response==${JSON.stringify(response)}`);
            console.log(`==SessionAttributes==${JSON.stringify(sessionAttributes, null, 2)}`);
        }
    };


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RatingIntentHandler,
        RatingEventHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler)
    .addRequestInterceptors(LocalizationInterceptor, RequestInterceptor)
    .addResponseInterceptors(ResponseInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();