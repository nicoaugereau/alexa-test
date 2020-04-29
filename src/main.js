//
// https://www.thepolyglotdeveloper.com/2018/11/building-amazon-alexa-skills-nodejs-revisited/
const Alexa = require("ask-sdk-core");
const Request = require("request-promise");
const SSMLBuilder = require("ssml-builder");
const { parseString } = require("xml2js");

const ErrorHandler = {
    canHandle(input) {
        return true;
    },
    handle(input) {
        return input.responseBuilder
            .speak("Sorry, I couldn't understand what you asked. Please try again.")
            .reprompt("Sorry, I couldn't understand what you asked. Please try again.")
            .getResponse();
    }
}
const AboutHandler = {
    canHandle(input) {
        return input.requestEnvelope.request.type === "IntentRequest" && input.requestEnvelope.request.intent.name === "AboutIntent";
    },
    handle(input) {
        return input.responseBuilder
            .speak("Slick Dealer was created by Nic Raboy in Tracy, California")
            .withSimpleCard("About Slick Dealer", "Slick Dealer was created by Nic Raboy in Tracy, California")
            .getResponse();
    }
}

const getFrontpageDeals = async () => {
    try {
        var response = await Request({
            uri: "https://slickdeals.net/newsearch.php",
            qs: {
                "mode": "frontpage",
                "searcharea": "deals",
                "searchin": "first",
                "rss": "1"
            },
            json: false
        });
        return await new Promise((resolve, reject) => {
            parseString(response, (error, result) => {
                if(error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    } catch (error) {
        throw error;
    }
}

const FrontpageDealsHandler = {
    canHandle(input) {
        return input.requestEnvelope.request.type === "IntentRequest" && input.requestEnvelope.request.intent.name === "FrontpageDealsIntent";
    },
    async handle(input) {
        try {
            var builder = new SSMLBuilder();
            var feedResponse = await getFrontpageDeals();
            for(var i = 0; i < feedResponse.rss.channel[0].item.length; i++) {
                builder.say(feedResponse.rss.channel[0].item[i].title[0]);
                builder.pause("1s");
            }
            return input.responseBuilder
                .speak(builder.ssml(true))
                .getResponse();
        } catch (error) {
            throw error;
        }
    }
}


var skill;

exports.handler = async (event, context) => {
    if(!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addRequestHandlers(
                // Handlers go here...
            )
            .addErrorHandlers(ErrorHandler)
            .create();
    }
    var response = await skill.invoke(event, context);
    return response;
};
