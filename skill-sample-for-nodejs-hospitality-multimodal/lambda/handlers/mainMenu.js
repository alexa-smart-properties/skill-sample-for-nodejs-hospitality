// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

const Alexa = require('ask-sdk-core');
const constant = require('../constants.js');

module.exports = {
    build_home_page(handlerInput, buttonPressed=false, speechOutput="", noPrompt=false) {
        const { attributesManager, responseBuilder } = handlerInput
        const requestAttributes = attributesManager.getRequestAttributes();
        
        let speakOutput = "";
        let repromptOutput = `${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;;

        if (speechOutput) {
            if (!noPrompt) {
                speakOutput = speechOutput + " " + requestAttributes.t('PROMPT');
            } else {
                speakOutput = speechOutput;
            }
        }
        else {
            if (Alexa.isNewSession(handlerInput.requestEnvelope)) {
                speakOutput = speakOutput + `${requestAttributes.t('WELCOME_LONG')} ${requestAttributes.t('MAIN_MENU')} ${requestAttributes.t('PROMPT')}`;
            } else {
                speakOutput = speakOutput + `${requestAttributes.t('WELCOME_BACK')} ${requestAttributes.t('PROMPT')}`;
            }    
        }
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
            let data = require('../languages/data/mainMenuInfo.json')
            let home_apl = require('../apl/home.json'); 

            responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: constant.HOME_PAGE_TOKEN,
                document: home_apl,
                datasources: data
            });
        }

        if (!buttonPressed){
            responseBuilder.withShouldEndSession(false) ;
            return responseBuilder
            .reprompt(repromptOutput)
            .speak(speakOutput)
            .getResponse(); 
        } else {
            return responseBuilder
            .getResponse();
        }
    }
}