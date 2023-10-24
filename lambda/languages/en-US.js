// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

module.exports = {
    translation: {
        WELCOME_LONG: 'Welcome to the Alexa Demo Hotel, your guide to delighting hotel guests with a voice experience.',
        WELCOME_BACK: ['Welcome back to the Alexa Hotel Experience.'],
        MAIN_MENU: 'You can ask about hotel facilities, dining, or room service.',
        PROMPT: ['How can I help?', 'Is there anything I can do for you?', 'What can I help you with?'],

        HELP: 'You\'re in the Alexa Hotel Experience. You can ask me questions like where is the pool or what time is the restaurant open. You can also ask me to order room service or request turn down service. Forget your toothbrush or need an extra towel? Just let me know what you need and I can have a staff member bring it to your room.',

        GOODBYE: 'Enjoy your stay.',
        FALLBACK: 'It looks like I can\'t do that.',
        ERROR: 'Sorry, I had trouble doing what you asked. Please try again. ',
        ERROR_UNAVAILABLE: 'Looks like I don\'t have that.',

        BILLING: 'Your total bill would be one thousand, five hundred and fifty dollars for your five day stay with us.  Plus any additional room service charges during your stay.',
        CLEANING_CANCEL: 'Ok, your room cleaning request has been cancelled.',
        CLEANING_CANCELABORT: 'OK.',
        CLEANING_REQUEST: 'Ok, your room cleaning request has been sent to house keeping.',

        ROOMSERVICE: 'You can request room items such as towels, toothbrush, or extra pillows and blankets.  You can also order food items such as coffee, sandwiches or burgers.',
        ROOMDELIVERY: 'OK, a staff will arrive with your requested items shortly.',
        ROOMDELIVERY_CANCEL: 'Ok, your request is cancelled.',
        FOODDELIVERY: 'OK, a staff will arrive with your ordered food items shortly.',
        FOODDELIVERY_CANCEL: 'Ok, your food order is cancelled.',

        WIFI: 'Wi-fi is free for all of our guest.  Connect to the access point that is on your floor for fastest speed.',
        WIFI_PASSWORD: 'The wi-fi password for your room is ',//TO DO: password for in hotel wifi should retrieved from a secure cloud storage location by the skill handler and returned in this skill response
 
        CHECKOUT_CONFIRM: 'You are now checked out of the room.  The total amount charged to your credit card on file is one thousand, nine hundred and eighty four dollars for your five days with us. Please make sure to take all your belongings when you leave the room.  Thank you for staying at the Alexa demo hotel!', 
        CHECKOUT_CANCEL: 'OK, your checkout request has been cancelled.',
        CHECKOUT_TIME: 'Checkout is at 12:00 p.m.',
        CHECKOUT_REQUEST: 'We hope you enjoyed your stay',

        CHECKOUT: 'Checkout is at noon.  Please call the front desk if you would like to request a late check out.',
        LOCATION: 'Nestled in the vibrant district of the city, Alexa Smart Properties demo hotel is walking distance to most famous attractions, shopping and restaurants in the city. There are three hundred and forty six guest rooms, including thirteen luxury suites to choose from.  Come stay with us at the Alexa Smart Properties demo hotel!',
        AMENITIES: 'Our hotel offers the following amenities, free wi-fi, on-site restaurant, fitness center, pool, spa, business center, conference rooms, ball rooms and concierge service.',

        PROPERTYFEATURES: {
            GYM: 'Never miss a beat in your fitness routine.  Get into your groove in our fitness center with a variety of cardio machines, strength training equipment including kettlebells and free weights, and an open yoga studio.  Relax your muscles after a hard workout in our sauna. Your hotel keycard is required for access to the fitness center.',
            BAR: 'Unwind after a day of sightseeing or outdoor activities at our lounge BAR.  Enjoy a local brew or a sophisticated cocktail while you soak in the city lights.  ',
            CAFE: 'The cafe near our lounge area offers a selection of handcrafted coffee, or uncaffeinated beverages as well as delectable baked goods and breakfast items.  Take them as you go about your day, or enjoy your breakfast in our CAFE.  No reservation is necessary.',
            POOL: 'Dive into our naturally treated, saline lap indoor POOL, where you can combine invigorating exercise with relaxing views of  city lights. The warm saline induces muscle relaxation while you unwind after a workout or a walk along the waterfront.',
            BUSINESS: 'The business center offers a variety of services while you are staying with us, from computer internet access, facsimile, printing, and photocopying services.  You will need your hotel keycard to use the business center.',
            CONFERENCE: 'Our hotel location make us the optimal destination to enjoy work and play.  We offer welcoming and engaging venues with floor to ceiling city views, and an abundant amount of natural light.  Our expert planners and audiovisual crew are also onsite to help you plan and execute your conference events that will stir up rave reviews.  Advanced reservation is required.',
            SHOP: 'Visit our on-site shop to find gifts and sourvenirs for your loved ones who were not able to travel with you.  Credit card payment is accepted.',
            RESTAURANT: 'The culinary team in our on-site restaurant focuses on fresh and local, changing with the seasons and connecting with the region. We show respect to our ingredients by utilizing techniques that elevate all flavors to our dishes.  Reservation is strongly recommended.',
            BALLROOM: 'Get ready to celebrate at our hotel.  Step into our elegant and transformative ballroom, providing the perfect chandeliers and backdrop for any occassion, or become a part of the city with our ballroom foyer floor to ceiling windows.  Advance reservation is required.',
            CONCIERGE: 'Not sure what to do while staying in our city, visit or call our front desk concerige.  Our friendly expert staff will help you figure out what you want to do, where you want to go, and what you would want to eat aroudn the city.',
            SPA: 'Explore the eco-friendly spa menu at our hotel. Our commitment to minimize impact on the Earth begins by using organic, locally sourced products in every treatment. Our team of expert spa therapists will tailor treatments to fit your specific needs including overall wellbeing, detoxification, and injury recovery. Reservation is recommended.'
        },

        PROPERTYLOCATIONS: {
            GYM: 'The fitness center is located on the fifth floor.  Turn right after you exit the elevator.  You will need your room key card to enter.',
            BAR: 'The bar is left to the hotel lobby on the second floor.',
            CAFE: 'The cafe is to the right of the hotel lobby on the second floor.',
            POOL: 'The pool is located on the twelfth floor.  You will need your room key card to enter the POOL and locker room changing area.',
            BUSINESS: 'The business center is located on the third floor of the hotel.',
            CONFERENCE: 'The conference rooms is on the third floor of the hotel.',
            SHOP: 'The gift shop is located on the second floor of the hotel near the entrance.',
            RESTAURANT: 'The restaurant is on the fifteenth floor of the hotel.',
            BALLROOM: 'The ballroom is on the third floor of the hotel.',
            CONCIERGE: 'The concierge is in the hotel lobby on the second floor.',
            SPA: 'The spa is located on the fifth floor.  Turn left after you exit the elevator.'
        },
        
        PROPERTYHOURS: {
            GYM: 'The fitness center is open daily from six AM to ten PM.',
            BAR: 'The bar is open daily from twelve PM to eleven PM.',
            CAFE: 'The cafe is open daily from five AM to six PM.',
            POOL: 'The pool is open daily from six AM to eight PM.',
            BUSINESS: 'The business center is open daily from twelve PM to eleven PM.',
            CONFERENCE: 'The conference rooms can be reserved daily from eight AM to ten PM.',
            SHOP: 'The gift shop is open daily from nine AM to eight PM.',
            RESTAURANT: 'The restaurant is open from six AM to ten PM.',
            BALLROOM: 'The ballroom can be reserved from eight AM to ten PM.',
            CONCIERGE: 'The concierge is staffed everyday from eight AM to eight PM',
            SPA: 'The spa is open daily from eight AM to eight PM.'    
        },
		
		PIN_REQUEST: 'Provide your pin to finish notifying room turnover',
		PIN_REQUEST_REPROMPT: 'Please enter the PIN.',
		PIN_VALIDATED: 'The pin is validated successfully, Room is turned over',
		PIN_INVALID: 'Sorry, the PIN you entered is incorrect.'
    }
}