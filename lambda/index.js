/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const WasteReductionTips = require('./WasteReductionTips.js');
const EcoFriendlyTransportationTips = require('./EcoFriendlyTransportationTips.js');
const EnergySavingTips = require('./EnergySavingTips.js');
const SustainableEatingTips = require('./SustainableEatingTips.js');
const SustainableShoppingTips = require('./SustainableShoppingTips.js');
const WaterConservationTips = require('./WaterConservationTips.js');
const firebase = require('firebase/app');
require('firebase/database')

const firebaseConfig = {
  apiKey: "AIzaSyBSWeWvcwXu-Egde8KIB3dwxAV9zhX0mHM",
  authDomain: "sustainabot-ebe16.firebaseapp.com",
  databaseURL: "https://sustainabot-ebe16-default-rtdb.firebaseio.com",
  projectId: "sustainabot-ebe16",
  storageBucket: "sustainabot-ebe16.appspot.com",
  messagingSenderId: "101705013779",
  appId: "1:101705013779:web:7d6979e96dd5b3b2b03de6"
};

firebase.initializeApp(firebaseConfig);

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to SustainaBot. If this is your first time, please say help.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelpIntent';
    },
    async handle(handlerInput) {
        var speakOutput;
        
        var cateogorySlot = Alexa.getSlot(handlerInput.requestEnvelope, "category");
        var category = cateogorySlot.value;
        
        if (category.toLowerCase() === 'energy saving'){
            speakOutput = EnergySavingTips[Math.floor(Math.random() * EnergySavingTips.length)];
        } else if (category.toLowerCase() === 'eco-friendly transportation'){
            speakOutput = EcoFriendlyTransportationTips[Math.floor(Math.random() * EcoFriendlyTransportationTips.length)];
        } else if(category.toLowerCase() === 'waste reduction'){
            speakOutput = WasteReductionTips[Math.floor(Math.random() * WasteReductionTips.length)];
        } else if(category.toLowerCase() === 'sustainable eating'){
            speakOutput = SustainableEatingTips[Math.floor(Math.random() * SustainableEatingTips.length)];
        } else if(category.toLowerCase() === 'water conservation'){
            speakOutput = WaterConservationTips[Math.floor(Math.random() * WaterConservationTips.length)];
        } else if(category.toLowerCase() === 'sustainable shopping'){
            speakOutput = SustainableShoppingTips[Math.floor(Math.random() * SustainableShoppingTips.length)];
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const IncreaseGarbageBagsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'IncreaseGarbageBagsIntent';
    },
    async handle(handlerInput) {
        var speakOutput;
        
        var numSlot = Alexa.getSlot(handlerInput.requestEnvelope, "number");
        var num = numSlot.value;
        var newVal;
        
        firebase.database().goOnline();
        await firebase.database().ref('garbage-bags').once('value').then((snapshot) => {
            const data = snapshot.val();
            newVal = parseInt(data) + parseInt(num);
        });
        await firebase.database().ref('garbage-bags').set(String(newVal));
        speakOutput = "You have now used " + String(newVal) + " garbage bags.";
        firebase.database().goOffline();
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const NumGarbageBagsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NumGarbageBagsIntent';
    },
    async handle(handlerInput) {
        var speakOutput;
        
        firebase.database().goOnline();
        await firebase.database().ref('garbage-bags').once('value').then((snapshot) => {
            const data = snapshot.val();
            speakOutput = "You have used " + data + " garbage bags."
        });
        firebase.database().goOffline();

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const IncreaseTipsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'IncreaseTipsIntent';
    },
    async handle(handlerInput) {
        var newVal;
        var speakOutput;
        
        firebase.database().goOnline();
        await firebase.database().ref('tip-streak').once('value').then((snapshot) => {
            const data = snapshot.val();
            newVal = String(parseInt(data)+1);
        });
        await firebase.database().ref('tip-streak').set(newVal);
        speakOutput = "You have now followed " + String(newVal) + " sustainability tips!";
        firebase.database().goOffline();

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
}

const fillWaterBottleIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'fillWaterBottleIntent';
    },
    async handle(handlerInput) {
        var speakOutput;
        
        var numSlot = Alexa.getSlot(handlerInput.requestEnvelope, "number");
        var num = numSlot.value;
        var newVal;
        
        firebase.database().goOnline();
        await firebase.database().ref('water').once('value').then((snapshot) => {
            const data = snapshot.val();
            newVal = parseInt(data) + parseInt(num);
        });
        await firebase.database().ref('water').set(String(newVal));
        speakOutput = "You have now filled " + String(newVal) + " water bottles.";
        firebase.database().goOffline();
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
}

const NumWaterBottleIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NumWaterBottleIntent';
    },
    async handle(handlerInput) {
        var speakOutput;
        
        firebase.database().goOnline();
        await firebase.database().ref('water').once('value').then((snapshot) => {
            const data = snapshot.val();
            speakOutput = "You have filled " + data + " water bottles."
        });
        firebase.database().goOffline();

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hi! Welcome to SustainaBot. If this is your first time, please say help.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const AMAZONHelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'I can help you with Energy Saving, Sustainable Eating, Sustainable Shopping, Waste Reduction, Water Conservation, or Eco Friendly Transportation!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        IncreaseGarbageBagsIntentHandler,
        NumGarbageBagsIntentHandler,
        IncreaseTipsIntentHandler,
        fillWaterBottleIntentHandler,
        NumWaterBottleIntentHandler,
        HelloWorldIntentHandler,
        AMAZONHelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();