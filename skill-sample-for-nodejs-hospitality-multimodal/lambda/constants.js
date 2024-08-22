// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

module.exports = Object.freeze({
    // skill connection task facility info argument names
    FACILITY_INFO_TYPE: 'information_type',
    FACILITY_TYPE: 'facility_type',

    // APL document tokens
    AMENITY_PAGE_TOKEN: 'amenityToken',
    BILLING_PAGE_TOKEN: "billingToken",
    CHECKOUT_PAGE_TOKEN: "checkoutToken",
    CHECKEDOUT_PAGE_TOKEN: "checkedoutToken",
    CHECKOUT_CONFIRM_PAGE_TOKEN: 'checkoutConfirmToken',
    CHECKOUTTIME_PAGE_TOKEN: "checkoutTimeToken",
    CONFIRM_PAGE_TOKEN: "confirmToken",
    HOTELINFO_PAGE_TOKEN: "hotelInfoToken",
    DIRECTORY_PAGE_TOKEN: "phoneDirectory",
    DINING_PAGE_TOKEN: "diningToken",
    EVENT_PAGE_TOKEN: "eventToken",
    HELP_PAGE_TOKEN: "helpToken",
    HOME_PAGE_TOKEN: 'homeToken',
    LOYALTY_PAGE_TOKEN: "loyaltyToken",
    REQUEST_CONFIRM_PAGE_TOKEN: "roomRequestConfirmToken",
    ROOM_REQUEST_PAGE_TOKEN: "roomRequestToken",
    TOUR_PAGE_TOKEN: "tourToken",
    WELCOME_PAGE_TOKEN: "welcomeToken",
    WIFI_PAGE_TOKEN: "wifiToken",

    // SendEvent Arguments
    AMENITY_MAIN: 'homeAmenity',
    BAR_CARD_USER_EVENT: 'barcard',
    EVENT_CARD_USER_EVENT: "eventcard",    
    HOUSE_KEEPING_INFO: 'RoomCleaningRequestIntent',
    GYM_CARD_USER_EVENT: 'gymcard',
    LOYALTY_PROGRAM_CARD_USER_EVENT: 'loyaltyprogramcard',
    PHONE_DIRECTORY_INFO: 'PBXCallRequestIntentHandler',
    ROOM_ITEMREQUEST_INFO: 'RoomDeliverableRequestIntent',
    ROOM_SERVICE_INFO: 'GeneralRoomServiceIntent',
    ROOM_CHECKOUT_INFO: 'CheckoutRequestIntent',
    RESTAURANT_CARD_USER_EVENT: 'restaurantcard',    
    SPA_CARD_USER_EVENT: 'spacard',
    TOUR_CARD_USER_EVENT: "tourcard",
    TOUR_BUTTON_EVENT: "tourbutton",
    VIDEO_PLAYER: 'videoPlayerId',
    WIFIINFO: 'WifiAccessFreeIntent',

    HOTELINFO_DEFAULT: 'restaurant',
    LOCATION: 'PROPERTY_AMENITY',
    PROPERTY_INFO_TYPE: {
        FEATURES: 'PROPERTYFEATURES',
        HOURS: 'PROPERTYHOURS',
        LOCATIONS: 'PROPERTYLOCATIONS'
    },

    // Skill states
    FIRST_RUN: 'NEW_USER',
    STATE: 'SKILL_STATE',
    STATES: {
        CHECKOUT: '_CHECKOUT_MODE',
        HOURS: '_HOURS_MODE',
        HOUSEKEEPING: '_HOUSEKEEPING_MODE',
        HOUSEKEEPINGCANCEL: '_HOUSEKEEPINGCANCEL_MODE',
        LOCATION: '_LOCATION_MODE',
        MENU: '_MENU_MODE',
        PBX: '_PBX_MODE',
        QA: '_QA_MODE',
        ROOM_ITEM_REQUEST: '_ROOMITEMREQUEST_MODE',
        ROOM_ITEM_REQUEST_CONFIRM: '_ROOMITEMREUQESTCONFIRM_MODE'
    },

    PBX_DEPARTMENT: 'PBXDepartment',
    PBX_EXTENSION: 'PBXExtension',

    HOTEL_INFO: {
        room_number: 'twenty thirty eight.',
        phone: 'seven zero two, eight eight eight, six six six six.',
        name: 'Maveri Las Vegas.',
        address: 'three three five five south Las Vegas Blvd, Las Vegas, nevada, eight nine one zero nine.',
        hotel_info_display_text: '<b>Maveri Las Vegas</b><br><br> 3355 South Las Vegas Blvd,<br>Las Vegas, Nevada, 89109.<br>TEL: (702) 888-6666<br><br>Your Room Number: 2038'
    },

    FEATURES: {
        gym: {
            image: 'gym.jpeg',
            image2: 'Gym2.jpg',
            text: 'Gym',
            location: '5th floor',
            hours: 'Open Daily. 6 AM to 10 PM',
            hintText: "Try, \"Alexa, where is the gym?\""
        },
        bar: {
            image: 'bar.jpeg',
            image2: 'Bar2.jpg',
            text: 'Horizon Haven',
            location: 'Hotel lobby',
            hours: 'Open Daily. 12 PM to 11 PM',
            hintText: "Try, \"Alexa, where is the bar?\""
        },
        happyhour: {
            image: 'bar.jpeg',
            image2: 'HappyHour2.jpg',
            text: 'Happy Hour',
            location: 'Hotel lobby',
            hours: 'Starts Daily. 4 PM to 6 PM',
            hintText: "Try, \"Alexa, where is the bar?\""
        },
        cafe:{
            image: 'cafe.jpeg',
            image2: 'Cafe2.jpg',
            text: 'Cafe',
            location: 'Hotel lobby',
            hours: 'Open Daily. 5 AM to 6 PM',
            hintText: "Try, \"Alexa, where is the cafe?\""
        },
        pool:{
            image: 'pool.jpg',
            image2: 'Pool2.jpg',
            text: 'Pool',
            location: '12th floor',
            hours: 'Open Daily. 6 AM to 8 PM',
            hintText: "Try, \"Alexa, where is the pool?\""
        },
        business:{
            image: 'business.jpeg',
            image2: 'BusinessCenter.jpg',
            text: 'Business Center',
            location: '3rd floor',
            hours: 'Open Daily. 12 PM to 11 PM',
            hintText: "Try, \"Alexa, where is the business center?\""
        },
        conference:{
            image: 'conference.jpeg',
            image2: 'ConferenceRoom2.jpg',
            text: 'Conference Center',
            location: '3rd floor',
            hours: 'Open Daily. 8 AM to 10 PM',
            hintText: "Try, \"Alexa, where is the conference center?\""
        },
        shop:{
            image: 'shop.jpeg',
            image2: 'GiftShop2.jpg',
            text: 'Gift Shop',
            location: '2nd floor',
            hours: 'Open Daily. 9 AM to 8 PM',
            hintText: "Try, \"Alexa, where is the shop?\""
        },
        restaurant: {
            image: 'restaurant.jpeg',
            image2: 'restaurant2.jpg',
            text: 'Gourmet Grove',
            location: '15th floor',
            hours: 'Open Daily. 6 AM to 10 PM',
            hintText: "Try, \"Alexa, where is the restaurant?\""
        },
        ballroom: {
            image: 'ballroom.jpeg',
            image2: 'Ballroom2.jpg',
            text: 'Ballroom',
            location: '3rd floor',
            hours: 'Available for Reservations',
            hintText: "Try, \"Alexa, where is the ballroom?\""
        },
        concierge: {
            image: 'concierge.jpeg',
            image2: 'concierge2.jpg',
            text: 'Concierge',
            location: 'Hotel lobby',
            hours: 'Open Daily. 8 AM to 8 PM',
            hintText: "Try, \"Alexa, where is the concierge?\""
        },
        spa: {
            image: 'spa.jpeg',
            image2: 'Spa2.jpg',
            text: 'Sunrise Spa',
            location: '5th floor',
            hours: 'Open Daily. 8 AM to 8 PM',
            hintText: "Try, \"Alexa, where is the spa?\""
        }
    }
});