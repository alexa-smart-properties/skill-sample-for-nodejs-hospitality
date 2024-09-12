// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
'use strict'

/* CONSTANTS */
const Alexa = require('ask-sdk');
const config = require('./config.js');
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');
const util = require('./util.js');

// Files for each of the handlers
const baseHandlers = require('./baseHandlers.js');
const promotionsHandlers = require('./handlers/promotions.js');
const hotelInfoHandler = require('./handlers/hotelInfoHandler.js')
const checkoutHandlers = require('./handlers/checkout.js');
const hotelServicesHandlers = require('./handlers/hotelServices.js');
const communicationsHandlers = require('./handlers/communications.js');


// i18n library dependency, we use it below in a localization interceptor
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// i18n strings for all supported locales
const languageStrings = {
    'en-US': require('languages/en-US.js')
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
 * If this is the first start of the skill, grab the room's data from datastore and
 * set the session attributes to the persistent data.
 */
const GetUserDataInterceptor = {
    async process(handlerInput) {
        if (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Authorization.Grant') {
            return;
        }
        try {
            // for a new session, restore session attributes from persistance store
            if (handlerInput.requestEnvelope.session && handlerInput.requestEnvelope.session.new) {
                var persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
                handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
                console.debug(`sessionAttributes loaded from persistence storage: ${JSON.stringify(persistentAttributes)}`);
            }
            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes() || {};
            console.debug(`sessionAttributes retrieved: ${JSON.stringify(sessionAttributes)}`);

            // if current sessiona attributes is missing a PUID, grab it if we can to put it into the session attributes, and 
            // persist it 
            if (!Object.prototype.hasOwnProperty.call(sessionAttributes, "puid")) {
                let persistent_uid = null;
                if (handlerInput.requestEnvelope.context.System.unit && handlerInput.requestEnvelope.context.System.unit.persistentUnitId) {
                    // launched from normal launchrequest or intent request by voice or card coldlaunch
                    persistent_uid = handlerInput.requestEnvelope.context.System.unit.persistentUnitId;
                } else {
                    console.log('this request has no persistent unit id.');
                }

                if (persistent_uid) {
                    util.storeSessionAttribute(handlerInput, 'puid', persistent_uid);
                }

                handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
                await handlerInput.attributesManager.savePersistentAttributes();
            }
        } catch (err) {
            console.error(`REQUEST ERROR ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
            console.error(err);
        }
    }
};

const LogRequestInterceptor = {
	process(handlerInput) {
        console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
	}
};

const LoggingResponseInterceptor = {
    process(handlerInput) {
        console.log(`RESPONSE ENVELOPE = ${JSON.stringify(handlerInput.response)}`);
    }
};

/* FUNCTIONS */
function getPersistenceAdapter(tableName) {
    return new ddbAdapter.DynamoDbPersistenceAdapter({
      tableName: tableName,
      createTable: true,
    });
  }

/* LAMBDA SETUP */
exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(getPersistenceAdapter(config.TABLE_NAME))
    .addRequestHandlers(
        baseHandlers.LaunchIntentHandler,
        baseHandlers.CancelAndStopIntentHandler,
        baseHandlers.HelpIntentHandler,
        baseHandlers.SessionEndedRequestHandler,
        baseHandlers.YesIntentHandler,
        baseHandlers.NoIntentHandler,

        //menuHandlers
        baseHandlers.ConfirmUserEventHandler,
        baseHandlers.CancelUserEventHandler,
        baseHandlers.MainMenuUserEventHandler,
        baseHandlers.HelpMenuUserEventHandler,     
        baseHandlers.ExitButtonUserEventHandler,   
        baseHandlers.GobackIntentHandler,

        //General Hotel Information
        hotelInfoHandler.WelcomeMessageIntentHandler,  
        baseHandlers.WelcomeMessageVideoOnEndEventHandler,
        hotelInfoHandler.HotelInformationIntentHandler,
        hotelInfoHandler.WifiAccessFreeIntentHandler,
        hotelInfoHandler.WifiUserEventHandler,

        //Hotel Promotions
        promotionsHandlers.LoyaltyProgramUserEventHandler,
        promotionsHandlers.LoyaltyProgramIntentHandler,
        promotionsHandlers.TourAndActivityIntentHandler,
        promotionsHandlers.TourAndActivityUserEventHandler,
        promotionsHandlers.NearByEventIntentHandler,
        promotionsHandlers.NearByEventUserEventHandler,

        //Amenities
        hotelInfoHandler.AmenityInformationIntentHandler,
        hotelInfoHandler.PropertyFeatureOperatingHoursIntentHandler,
        hotelInfoHandler.GeneralPropertyFeaturesIntentHandler,
        hotelInfoHandler.PropertyFeatureLocationIntentHandler,
        hotelInfoHandler.AmenityHomeHandler,

        //Checkout
        checkoutHandlers.CheckoutTimeIntentHandler,
        checkoutHandlers.CheckoutUserEventHandler,
        checkoutHandlers.CheckoutRequestIntentHandler,
        checkoutHandlers.CheckoutConfirmUserEventHandler,  
        checkoutHandlers.CheckoutCancelUserEventHandler,
        checkoutHandlers.BillingInformationIntentHandler,

        //Hotel Services
        hotelServicesHandlers.GeneralRoomServiceIntentHandler,
        hotelServicesHandlers.GeneralRoomServiceUserEventHandler,
        hotelServicesHandlers.SubmitRequestIntentHandler,
        hotelServicesHandlers.RemoveAllItemIntentHandler,
        hotelServicesHandlers.HousekeepingButtonUserEventHandler,
        hotelServicesHandlers.RoomCleaningRequestIntentHandler,
        hotelServicesHandlers.RoomCleaningCancelIntentHandler,
        hotelServicesHandlers.InRoomFoodRequestIntentHandler,
        hotelServicesHandlers.RoomItemSubmitUserEventHandler,
        hotelServicesHandlers.RoomDeliverableUserEventHandler, 
        hotelServicesHandlers.RoomDeliverableRequestIntentHandler,

        //Communications
        communicationsHandlers.AuthorizationGrantRequestHandler,
        communicationsHandlers.DirectoryButtonUserEventHandler,
        communicationsHandlers.PhoneDirectoryIntentIntentHandler,
        communicationsHandlers.CallButtonUserEventHandler,  
        communicationsHandlers.PBXCallRequestIntentHandler,
   
        // last catchup handler
        baseHandlers.UnhandledIntentHandler

    )
    .addErrorHandlers(baseHandlers.ErrorHandler)
    .addRequestInterceptors(
        GetUserDataInterceptor, LocalizationInterceptor, LogRequestInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .lambda();