//
// https://www.thepolyglotdeveloper.com/2018/11/building-amazon-alexa-skills-nodejs-revisited/
const { expect } = require("chai");
const main = require("../src/main");

describe("Testing a session with the AboutIntent", () => {
    var speechResponse = null
    var speechError = null

    before(async () => {
        try {
            speechResponse = await main.handler({
                "request": {
                    "type": "IntentRequest",
                    "intent": {
                        "name": "AboutIntent",
                        "slots": {}
                    },
                    "locale": "en-US"
                },
                "version": "1.0"
            });
        } catch (error) {
            speechError = error;
        }
    })
    describe("The response is structurally correct for Alexa Speech Services", function() {
        it('should not have errored',function() {
            expect(speechError).to.be.null
        })

        it('should have a version', function() {
            expect(speechResponse.version).not.to.be.null
        })

        it('should have a speechlet response', function() {
            expect(speechResponse.response).not.to.be.null
        })

        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })
    })
})
