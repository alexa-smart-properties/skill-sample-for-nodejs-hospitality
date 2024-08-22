// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

/* CONSTANTS */
const constants = require('./constants');

module.exports = {
    /**
     * Returns the target intent 
     * 
     * @param {Object} handlerInput 
     * @returns {String} The name of the intent from the request
     */
     parseIntent(handlerInput) {
        if(handlerInput.requestEnvelope.request.type === 'IntentRequest') {
            return handlerInput.requestEnvelope.request.intent.name;
        } else {
            return handlerInput.requestEnvelope.request.type;
        }
    },
    
    /**
     * Gets the root value of the slot even if synonyms are provided.
     *
     * @param {Object} handlerInput
     * @param {String} slot
     * @returns {String} The root value of the slot
     */
     getSlotResolution(handlerInput, slotName, slotType) {
        const intent = handlerInput.requestEnvelope.request.intent;
        if (!intent) {
            console.log('getSlotResolution: Not an intent request');
            return false;
        }
        else if (
            intent.slots[slotName] &&
            intent.slots[slotName].resolutions &&
            intent.slots[slotName].resolutions.resolutionsPerAuthority[0]
        ) {
            const resolutions = intent.slots[slotName].resolutions.resolutionsPerAuthority;

            for (let i = 0; i < resolutions.length; i++) {
                const authoritySource = resolutions[i];
                if (
                    authoritySource.authority.includes('amzn1.er-authority.echo-sdk.') &&
                    authoritySource.authority.includes(slotType)
                ) {
                    if (authoritySource.status.code === 'ER_SUCCESS_MATCH') {
                        return authoritySource.values[0].value.name;
                    }
                }
            }
            console.log('getSlotResolution: did not find match in ER, returning false');
            return false;
        } else if (intent.slots[slotName].value && !intent.slots[slotName].resolutions) {
            // For built-in intents that haven't been extended with ER
            return intent.slots[slotName].value;
        }
        console.log('getSlotResolution: did not find match at all, returning false');
        return false;
    },

    /**
     * Saves the specified attributes objects to either the session or to persistent DynamoDB.
     *
     * @param {Object} handlerInput - Alexa request that contains the skill request attributes
     * @param {Object} attributes - the attributes object to save
     * @param {String} mode The save type of persistent or session
     */
    saveUser(handlerInput, attributes, mode) {
        if (mode === 'session') {
            handlerInput.attributesManager.setSessionAttributes(attributes);
        } else if (mode === 'persistent') {
            console.info('Saving to Dynamo: ', attributes);

            if (attributes[constants.FIRST_RUN]) {
                attributes[constants.FIRST_RUN] = false;
            }

            handlerInput.attributesManager.setSessionAttributes(attributes);
            handlerInput.attributesManager.setPersistentAttributes(attributes);
            return handlerInput.attributesManager.savePersistentAttributes();
        }
    },

    /**
     * Saves the specified attribute name/value to skill session attribute
     *
     * @param {Object} handlerInput - Alexa request that contains the skill request attributes
     * @param {Object} attribute_name - the name of the attribute to save
     * @param {Object} attribute_value - the value of the attribute to save
     * @param {String} mode The save type of persistent or session
     */
    storeSessionAttribute(handlerInput, attribute_name, attribute_value) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes[attribute_name] = attribute_value;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }
}