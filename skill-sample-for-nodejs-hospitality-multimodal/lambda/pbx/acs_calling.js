// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

const axios = require('axios')
const asp_api = require('./asp_api.js');
const config = require('../config.js')
const { v4: uuid } = require('uuid');

module.exports = {
    async acs_call(handlerInput, extension_num) {

        // get the puid (it should be in the session, if not, log error and exit)
        if (handlerInput.requestEnvelope.session.attributes.puid == undefined) {
            console.error('puid not found in session');
            return;
        }
        console.debug(`Session PUID is ${handlerInput.requestEnvelope.session.attributes.puid}`);
        const comms_profile_id = await asp_api.get_comms_profile_id_from_puid(handlerInput.requestEnvelope.session.attributes.puid);
        const device_endpoint_id = handlerInput.requestEnvelope.context.System.device.deviceId;
        
        //communication calling id is: amzn1.comms.csp.id.c0e1cd84-a846-11ed-afa1-0242ac120002
        let post_data =  `{ "participants": [ { "id": { "type": "COMMUNICATION_PROFILE_ID", "value": "${comms_profile_id}" }, "communicationProviderId": "${config.COMMUNICATION_PROVIDER_ID}", "endpointId": "${device_endpoint_id}", "isOriginator": true }, { "id": { "type": "RAW_ADDRESS", "value": "${extension_num}" }, "communicationProviderId": "${config.COMMUNICATION_PROVIDER_ID}" } ], "clientContext": { "clientSessionId": "${uuid()}"}}`;
        
        const api_config = {
            headers: {
                Authorization: `Bearer ${handlerInput.requestEnvelope.context.System.apiAccessToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        };

        let url = 'https://api.amazonalexa.com/v1/communications/session';
        axios.post(url, post_data, api_config)
            .then((response) => {
                if (response.status == 200) {
                    console.debug ('calling successful');
                } 
            }, (error) => {
                console.error(`calling failed: ${error}`);
                console.error(error);
            });
    }
}