// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

const sm = require('@aws-sdk/client-secrets-manager');
const axios = require('axios');
const config = require('../config');

// Function to retrieve OAuth2 required information from AWS Secrets Manager
async function getOAuthRequiredInfo(client) {
    const secretNameForOAuth = config.SECRET_MGR_S_NAME_ASP_OAUTH;
   
    try {
        const getSecretValueResponse = await client.send(
            new sm.GetSecretValueCommand({
                SecretId: secretNameForOAuth,
                VersionStage: "AWSCURRENT", 
            })
        );
        
        return JSON.parse(getSecretValueResponse.SecretString);
    } catch (error) {
        console.log('Error in getOAuthRequiredInfo:', error);
        throw error;
    }
}

// Function to perform Login with Amazon (LWA) OAuth2 authentication and retrieve access token
// using the refresh token stored in the secret manager
async function lwaOAuth(oauthInfo) {
    const requestBody = {
        grant_type: 'refresh_token',
        refresh_token: oauthInfo[config.SECRET_MGR_S_NAME_ASP_RT],
        client_id: oauthInfo[config.SECRET_MGR_S_NAME_ASP_CI],
        client_secret: oauthInfo[config.SECRET_MGR_S_NAME_ASP_CS],
        scope: oauthInfo[config.SECRET_MGR_S_NAME_ASP_SCOPE],
    };

    try {
        // Send a POST request to LWA service to obtain access token
        const response = await axios.post(oauthInfo[config.SECRET_MGR_S_NAME_AUTH_URL], new URLSearchParams(requestBody), {
            headers: { 'Accept': 'application/x-www-form-urlencoded' },
        });

        if (response.status === 200) {
            // Return the access token if request is successful
            return response.data.access_token;
        } else {
            return null;
        }
    } catch (error) {
        console.log('Error in lwaOAuth:', error);
        throw error;
    }
}

// NOTE: Usually, one would store the access token in the secret manager as well, and obtain
// the access token from the secret manager instead of doing authorization every time.
// however, in the sample, we are only needing the access token when starting a PBX call
// so here we simplify and always obtain a fresh access token from oAuth
module.exports = {
    async getAspAccessToken() {
        let accessToken = '';
        try {
            const regionName = config.REGION;
            const client = new sm.SecretsManager({ region: regionName });
            accessToken = await lwaOAuth(await getOAuthRequiredInfo(client));
        } catch (error) {
            console.error('Error in getAspAccessToken:', error);
        }
        return `Bearer ${accessToken}`;
    }
};