// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

module.exports = Object.freeze({
    // define the application states to handle the different interactions
    STATES: {
      MENU: '_MENU_MODE',
      QA: '_QA_MODE',
      HOURS: '_HOURS_MODE',
      LOCATION: '_LOCATION_MODE'
    },

    STATE: 'SKILL_STATE',
    FIRST_RUN: 'NEW_USER',
    LOCATION: 'PROPERTY_AMENITY',

    FEATURES: {
        gym: {
            image: 'gymGH.jpeg',
            text: 'Gym',
            hours: 'Open Daily. 6 a.m. to 10 p.m.',
            hintText: "Try, \"Alexa, where is the gym?\""
        },
        bar: {
            image: 'barGH.jpeg',
            text: 'Bar',
            hours: 'Open Daily. 12 p.m. to 11 p.m.',
            hintText: "Try, \"Alexa, where is the bar?\""
        },
        cafe:{
            image: 'cafeGH.jpeg',
            text: 'Cafe',
            hours: 'Open Daily. 5 a.m. to 6 p.m.',
            hintText: "Try, \"Alexa, where is the cafe?\""
        },
        pool:{
            image: 'poolGH.jpg',
            text: 'Pool',
            hours: 'Open Daily. 6 a.m. to 8 p.m.',
            hintText: "Try, \"Alexa, where is the pool?\""
        },
        business:{
            image: 'businessGH.jpeg',
            text: 'Business Center',
            hours: 'Open Daily. 12 p.m. to 11 p.m.',
            hintText: "Try, \"Alexa, where is the business center?\""
        },
        conference:{
            image: 'conferenceGH.jpeg',
            text: 'Conference Center',
            hours: 'Open Daily. 8 a.m. to 10 p.m.',
            hintText: "Try, \"Alexa, where is the conference center?\""
        },
        shop:{
            image: 'shopGH.jpeg',
            text: 'Gift Shop',
            hours: 'Open Daily. 9 a.m. to 8 p.m.',
            hintText: "Try, \"Alexa, where is the shop?\""
        },
        restaurant: {
            image: 'restaurantGH.jpeg',
            text: 'Restaurant',
            hours: 'Open Daily. 6 a.m. to 10 p.m.',
            hintText: "Try, \"Alexa, where is the restaurant?\""
        },
        ballroom: {
            image: 'ballroomGH.jpeg',
            text: 'Ballroom',
            hours: 'Available for Reservations',
            hintText: "Try, \"Alexa, where is the ballroom?\""
        },
        concierge: {
            image: 'conciergeGH.jpeg',
            text: 'Concierge',
            hours: 'Open Daily. 8 a.m. to 8 p.m.',
            hintText: "Try, \"Alexa, where is the concierge?\""
        },
        spa: {
            image: 'spaGH.jpeg',
            text: 'Spa',
            hours: 'Open Daily. 8 a.m. to 8 p.m.',
            hintText: "Try, \"Alexa, where is the spa?\""
        }
    },
    IMAGES: {
        LOBBY: 'lobbyGH.jpeg',
        TOWELS: 'towelsGH.jpeg',
        LOGO: 'alexa_logo.png',
        LUGGAGE: 'checkoutGH.jpeg',
        ROOM: 'roomGH.jpeg'
    }
});