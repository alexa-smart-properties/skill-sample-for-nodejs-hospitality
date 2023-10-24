// Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

const constants = require('./constants');
const config = require('./config');
const AWS = require('aws-sdk');

const s3SigV4Client = new AWS.S3({
    signatureVersion: 'v4'
});

module.exports = {
    /**
     * Returns the target intent 
     * 
     * @param {Object} handlerInput 
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
     getSlotResolution(handlerInput, slot) {
        const intent = handlerInput.requestEnvelope.request.intent;
        if (
            intent.slots[slot] &&
            intent.slots[slot].resolutions &&
            intent.slots[slot].resolutions.resolutionsPerAuthority[0]
        ) {
            const resolutions = intent.slots[slot].resolutions.resolutionsPerAuthority;

            for (let i = 0; i < resolutions.length; i++) {
                const authoritySource = resolutions[i];

                if (
                    authoritySource.authority.includes('amzn1.er-authority.echo-sdk.') &&
                    authoritySource.authority.includes(slot)
                ) {
                    if (authoritySource.status.code === 'ER_SUCCESS_MATCH') {
                        return authoritySource.values[0].value.name;
                    }
                }
            }
            return false;
        } else if (intent.slots[slot].value && !intent.slots[slot].resolutions) {
            // For built-in intents that haven't been extended with ER
            return intent.slots[slot].value;
        }

        return false;
    },

    getS3PreSignedUrl(s3ObjectKey) {

        const bucketName = config.S3_BUCKET;
        const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
            Bucket: bucketName,
            Key: s3ObjectKey,
            Expires: 60*4 // the Expires is capped for 1 minute
        });
        console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
        return s3PreSignedUrl
    },
    
    /**
     * Returns the target intent 
     * 
     * @param {Object} handlerInput 
     */
    parseIntent(handlerInput) {
        if(handlerInput.requestEnvelope.request.type === 'IntentRequest') {
            return handlerInput.requestEnvelope.request.intent.name;
        } else {
            return handlerInput.requestEnvelope.request.type;
        }
    },

    /**
     * Returns the target intent confirmation status
     * 
     * @param {Object} handlerInput
     */
     getConfirmationStatus(handlerInput) {
        let confirmStatus = handlerInput.requestEnvelope.request.intent.confirmationStatus;
        let dialogState = handlerInput.requestEnvelope.request.dialogState;
        
        console.log('Intent confirmation status: ' + confirmStatus);
        console.log('Dialog status: ' + dialogState);

        if  (handlerInput.requestEnvelope.request.type === 'IntentRequest') {
            // check for special edge case, if the dialog is complete without "NONE" as confirmation (due to ASK error), then assume intent is confirmed also.
            if ((dialogState == 'COMPLETED') && (confirmStatus == 'NONE')) {
                confirmStatus = 'CONFIRMED';
            }
        } else {
            console.log('Request is not an IntentRequest, setting confirmation Status to NONE.');
            confirmStatus = 'NONE';
        }
        return confirmStatus;
    },   

    /**
     * Saves the current attributes objects to either the session or to DynamoDB.
     *
     * @param {Object} handlerInput
     * @param {Object} attributes
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
}