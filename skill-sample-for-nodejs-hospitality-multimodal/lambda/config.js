// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

// TODO: update the configuration values below as needed
module.exports = Object.freeze({
    TABLE_NAME: 'HotelDemoUsers',       // DynamoDB Table name for skill persistance variables
    REGION: 'us-east-1',                // AWS region where AWS Secret Manager is deployed
    SECRET_MGR_S_NAME_ASP_OAUTH: 'amazon-api-access-token', // Name of the secret storing ASP auth information in secret manager
    SECRET_MGR_S_NAME_ASP_RT: 'lwa-refresh-token',          // Name of the secret key storing the refresh token 
    SECRET_MGR_S_NAME_ASP_CI: 'lwa-client-id',              // Name of the secret key storing the LWA client id
    SECRET_MGR_S_NAME_ASP_CS: 'lwa-client-secret',          // Name of the secret key storing the LWA client secret
    SECRET_MGR_S_NAME_ASP_SCOPE: 'lwa-auth-scope',          // Name of the secret key storing the scope
    SECRET_MGR_S_NAME_AUTH_URL: 'lwa-auth-url',             // Name of the secret key storing the auth url to get access token
    PBX_DEFAULT_EXTENSION: "9000",    // Update this to a working PBX extension your ASP Echo device can call.
    GUEST_NUMBER: '+14258821099', 
    COMMUNICATION_PROVIDER_ID: 'amzn1.comms.csp.id.c0e1cd84-a846-11ed-afa1-0242ac120002'    // com profile id for pbx calling (do not change)
});