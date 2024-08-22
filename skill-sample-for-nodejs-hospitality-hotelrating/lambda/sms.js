// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
"use strict";


// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// ID of AWS Pinpoint project. You can copy it your own AWS pintpoint project at:
// https://us-east-1.console.aws.amazon.com/pinpoint/home?region=us-east-1#/apps
// change the region above if not using us-east-1
const applicationId = "INSERT YOUR OWN PINPOINT PROJECT ID HERE"

// Set the region you're working in. Example: 'us-west-2'
AWS.config.update({ region: 'us-east-1' });

// Create a new Pinpoint object
const pinpoint = new AWS.Pinpoint();
   
module.exports = Object.freeze({

    /**
     * Send an SMS message using AWS Pinpoint.
     * 
     * @param {string} messageBody The content of the SMS message.
     * @param {string} recipientNumber The phone number to send the message to. Must be in E.164 format.
     * @param {string} applicationId The ID of the Amazon Pinpoint project/application that you want to send the message from.
     */
    SendSMSMessage(messageBody, recipientNumber) {

        // adding STS stuff in here since alexa hosted skill need to assume a role that has aws access
        
        const params = {
            ApplicationId: applicationId,
            MessageRequest: {
                Addresses: {
                    [recipientNumber]: {
                        ChannelType: 'SMS'
                    }
                },
                MessageConfiguration: {
                    SMSMessage: {
                        Body: messageBody,
                        MessageType: 'PROMOTIONAL'
                    }
                }
            }
        };

        pinpoint.sendMessages(params, function(err, data) {
            if (err) {
                console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Message sent! Message ID:", data['MessageResponse']['Result'][recipientNumber]['MessageId']);
            }
        });
    }
});
