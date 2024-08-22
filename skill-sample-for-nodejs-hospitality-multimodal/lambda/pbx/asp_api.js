// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

const axios = require('axios')
const asp_api_token = require('./access_token.js');

module.exports = {
    
    async get_comms_profile_id_from_puid (puid) {
        try {
            let url = `https://api.amazonalexa.com/v1/communications/profile?entity.type=UNIT&entity.id=${puid}`;
            let auth_token = await asp_api_token.getAspAccessToken();
            const config = {
                headers: {
                    Authorization: auth_token,
                    Accept: 'application/json'
                }
            };
    
            let res = await axios.get(url, config);
            if (res.status == 200 && res.data) {
                console.debug (`Comms profile id: ${res.data.profileId.profileId} for puid: ${puid}`);
                return res.data.profileId.profileId;
            } else {
                console.error (`Failed to get comms profile id from puid: ${puid} with API return status: ${res.status}`);
                return; 
            }
        } catch (error) {
            console.error(error)
        }
    },

    async get_asp_room_name(puid) {
        try {
            let auth_token = await asp_api_token.getAspAccessToken();
            let url = `https://api.amazonalexa.com/v2/units/${puid}`;
            const config = {
                headers: {
                    Authorization: auth_token,
                    Accept: 'application/json'
                }
            };

            let asp_response = await axios.get(url, config);
            console.debug(asp_response);
            if (asp_response.status == 200 && asp_response.data){
                console.debug(`${puid} : ${asp_response.data.name.value.text}`)
                return asp_response.data.name.value.text
            } else {
                return 'Lobby Unit'
            }
        } catch (error) {
            console.error(error)
        }
    },

    async update_asp_room_name(puid, name) {
        let auth_token = await asp_api_token.getAspAccessToken();

        let url = `https://api.amazonalexa.com/v2/units/${puid}`;
        const put_data =  `{"name": {"type": "PLAIN","value": {"text":"${name}"}}}`
        const config = {
            headers: {
                Authorization: auth_token,
                Accept: 'application/json'
            }
        };
        let asp_response = await axios.put(url, put_data, config);
        console.debug(asp_response);
        if (asp_response.status == 204) {
            console.debug (`Room name updated to ${name} for puid: ${puid}`)
        }
    }
}