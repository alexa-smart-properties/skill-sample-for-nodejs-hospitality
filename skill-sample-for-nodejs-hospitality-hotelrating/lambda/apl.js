// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
"use strict";

// Import helper functions and data
const BasicDocument = require('./apl/basicDocument.json');

/***
 * Function to produce APL for the rating card 
 * 
 */
function createDirectivePayload (aplDocument, sources = {}, tokenId = "documentToken") {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: aplDocument,
        datasources: sources
    };
}

/***
 * Function to produce APL command for setting the rating
 * 
 */
function setRatingPayload (rating, tokenId = "documentToken") {
    console.log("set rating value: ", rating);

    return  {
        "type": "Alexa.Presentation.APL.ExecuteCommands",
        "token": tokenId,
        "commands": [
            {
                "type": "SetValue",
                "componentId": "AlexahotelRating",
                "property": "ratingNumber",
                "value": parseInt(rating)
            }
        ]
    }
}

/***
 * Function to produce APL for Guest Sad rating card 
 * 
 */
function getSadRatingAPLDirectiveBasic() {
    const data = require('./data/sadRatingData.json');
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        document: BasicDocument,
        datasources: data
    };
}

/***
 * Function to produce APL for Guest happy rating card 
 * 
 */
function getHappyRatingAPLDirectiveBasic() {
    const data = require('./data/happyRatingData.json');
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        document: BasicDocument,
        datasources: data
    };
}

module.exports = {
    getSadRatingAPLDirectiveBasic,
    getHappyRatingAPLDirectiveBasic,
    createDirectivePayload,
    setRatingPayload
};
