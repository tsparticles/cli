import { describe, it } from "mocha";
import { expect } from "chai";
import { camelize, capitalize, dash } from "../src/utils/string-utils";

describe("capitalize", () => {
    describe("empty string", () => {
        expect(capitalize("")).to.be.equal("");
    });

    describe("lowercase string", () => {
        it("should return capitalized string", () => {
            expect(capitalize("test")).to.be.equal("Test");
        });
    });

    describe("capitalized string", () => {
        it("should return capitalized string", () => {
            expect(capitalize("Test")).to.be.equal("Test");
        });
    });

    describe("multiple lowercase words string", () => {
        it("should return capitalized string, no split", () => {
            expect(capitalize("test test")).to.be.equal("Test test");
        });

        it("should return capitalized string, split", () => {
            expect(capitalize("test test", " ")).to.be.equal("TestTest");
        });

        it("should return capitalized string, wrong split", () => {
            expect(capitalize("test test", ";")).to.be.equal("Test test");
        });
    });

    describe("multiple uppercase words string", () => {
        it("should return capitalized string, no split", () => {
            expect(capitalize("Test Test")).to.be.equal("Test Test");
        });

        it("should return capitalized string, split", () => {
            expect(capitalize("Test Test", " ")).to.be.equal("TestTest");
        });

        it("should return capitalized string, wrong split", () => {
            expect(capitalize("Test Test", ";")).to.be.equal("Test Test");
        });
    });
});

describe("camelize", () => {
    describe("empty string", () => {
        expect(camelize("")).to.be.equal("");
    });

    describe("lowercase string", () => {
        it("should return camelized string", () => {
            expect(camelize("test")).to.be.equal("test");
        });
    });

    describe("uppercase string", () => {
        it("should return camelized string", () => {
            expect(camelize("Test")).to.be.equal("test");
        });
    });

    describe("multiple lowercase words string", () => {
        it("should return camelized string, no split", () => {
            expect(camelize("test test")).to.be.equal("test test");
        });

        it("should return camelized string, split", () => {
            expect(camelize("test test", " ")).to.be.equal("testTest");
        });

        it("should return camelized string, wrong split", () => {
            expect(camelize("test test", ";")).to.be.equal("test test");
        });
    });

    describe("multiple uppercase words string", () => {
        it("should return camelized string, no split", () => {
            expect(camelize("Test Test")).to.be.equal("test Test");
        });

        it("should return camelized string, split", () => {
            expect(camelize("Test Test", " ")).to.be.equal("testTest");
        });

        it("should return camelized string, wrong split", () => {
            expect(camelize("Test Test", ";")).to.be.equal("test Test");
        });
    });
});

describe("dash", () => {
    describe("empty string", () => {
        expect(dash("")).to.be.equal("");
    });

    describe("lowercase string", () => {
        it("should return dashed string", () => {
            expect(dash("test")).to.be.equal("test");
        });
    });

    describe("uppercase string", () => {
        it("should return dashed string", () => {
            expect(dash("Test")).to.be.equal("test");
        });
    });

    describe("capitalized word string", () => {
        it("should return dashed string", () => {
            expect(dash("TestTest")).to.be.equal("test-test");
        });
    });

    describe("camelized word string", () => {
        it("should return dashed string", () => {
            expect(dash("testTest")).to.be.equal("test-test");
        });
    });
});
