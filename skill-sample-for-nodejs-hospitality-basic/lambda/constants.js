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
            image: 'https://d3oivqnhloy3be.cloudfront.net/gymGH.jpg',
            text: 'Gym',
            hours: 'Open Daily. 6 a.m. to 10 p.m.',
            hintText: "Try, \"Alexa, where is the gym?\""
        },
        bar: {
            image: 'https://d3oivqnhloy3be.cloudfront.net/barGH.jpg',
            text: 'Bar',
            hours: 'Open Daily. 12 p.m. to 11 p.m.',
            hintText: "Try, \"Alexa, where is the bar?\""
        },
        cafe:{
            image: 'https://d3oivqnhloy3be.cloudfront.net/cafeGH.jpg',
            text: 'Cafe',
            hours: 'Open Daily. 5 a.m. to 6 p.m.',
            hintText: "Try, \"Alexa, where is the cafe?\""
        },
        pool:{
            image: 'https://d3oivqnhloy3be.cloudfront.net/poolGH.jpg',
            text: 'Pool',
            hours: 'Open Daily. 6 a.m. to 8 p.m.',
            hintText: "Try, \"Alexa, where is the pool?\""
        },
        business:{
            image: 'https://d3oivqnhloy3be.cloudfront.net/businessGH.jpg',
            text: 'Business Center',
            hours: 'Open Daily. 12 p.m. to 11 p.m.',
            hintText: "Try, \"Alexa, where is the business center?\""
        },
        conference:{
            image: 'https://d3oivqnhloy3be.cloudfront.net/conferenceGH.jpg',
            text: 'Conference Center',
            hours: 'Open Daily. 8 a.m. to 10 p.m.',
            hintText: "Try, \"Alexa, where is the conference center?\""
        },
        shop:{
            image: 'https://d3oivqnhloy3be.cloudfront.net/shopGH.jpg',
            text: 'Gift Shop',
            hours: 'Open Daily. 9 a.m. to 8 p.m.',
            hintText: "Try, \"Alexa, where is the shop?\""
        },
        restaurant: {
            image: 'https://d3oivqnhloy3be.cloudfront.net/restaurantGH.jpg',
            text: 'Restaurant',
            hours: 'Open Daily. 6 a.m. to 10 p.m.',
            hintText: "Try, \"Alexa, where is the restaurant?\""
        },
        ballroom: {
            image: 'https://d3oivqnhloy3be.cloudfront.net/ballroomGH.jpg',
            text: 'Ballroom',
            hours: 'Available for Reservations',
            hintText: "Try, \"Alexa, where is the ballroom?\""
        },
        concierge: {
            image: 'https://d3oivqnhloy3be.cloudfront.net/conciergeGH.jpg',
            text: 'Concierge',
            hours: 'Open Daily. 8 a.m. to 8 p.m.',
            hintText: "Try, \"Alexa, where is the concierge?\""
        },
        spa: {
            image: 'https://d3oivqnhloy3be.cloudfront.net/spaGH.jpg',
            text: 'Spa',
            hours: 'Open Daily. 8 a.m. to 8 p.m.',
            hintText: "Try, \"Alexa, where is the spa?\""
        }
    },
    IMAGES: {
        LOBBY: 'https://d3oivqnhloy3be.cloudfront.net/lobbyGH.jpg',
        TOWELS: 'https://d3oivqnhloy3be.cloudfront.net/towelsGH.jpg',
        LOGO: 'https://d3oivqnhloy3be.cloudfront.net/alexa_logo.png',
        LUGGAGE: 'https://d3oivqnhloy3be.cloudfront.net/checkoutGH.jpg',
        ROOM: 'https://d3oivqnhloy3be.cloudfront.net/roomGH.jpg'
    }
});