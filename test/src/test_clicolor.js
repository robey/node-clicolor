"use strict";

const clicolor = require("../../lib/clicolor");
const magnitude = require("../../lib/magnitude");
const should = require("should");
const status = require("../../lib/status");
const util = require("util");

require("source-map-support").install();

describe("clicolor", () => {
  it("spans", () => {
    const cli = clicolor.cli();
    cli.useColor(true);
    cli.color("green", "kermit").toString().should.eql("\u001b[32mkermit\u001b[39m");
    cli.paint("it's so ", cli.color("error", "easy"), "!").toString().should.eql(
      "it's so \u001b[38;5;160measy\u001b[39m!"
    );

    cli.useColor(false);
    cli.color("green", "kermit").toString().should.eql("kermit");
    cli.paint("it's so ", cli.color("error", "easy"), "!").toString().should.eql(
      "it's so easy!"
    );
  });

  it("roundToPrecision", () => {
    magnitude.roundToPrecision(123, 1).should.eql(100);
    magnitude.roundToPrecision(123, 2).should.eql(120);
    magnitude.roundToPrecision(123, 3).should.eql(123);
    magnitude.roundToPrecision(123, 1, "ceil").should.eql(200);
    magnitude.roundToPrecision(123, 2, "ceil").should.eql(130);
    magnitude.roundToPrecision(123, 3, "ceil").should.eql(123);
    magnitude.roundToPrecision(0, 3).should.eql(0);
  });

  it("toMagnitude", () => {
    const cli = clicolor.cli();
    cli.toMagnitude(0).should.eql("0");
    cli.toMagnitude(1).should.eql("1");
    cli.toMagnitude(109).should.eql("109");
    cli.toMagnitude(999).should.eql("999");

    cli.toMagnitude(1000, 1024.0).should.eql("1000");
    cli.toMagnitude(1001, 1024.0).should.eql("1001");
    cli.toMagnitude(1024, 1024.0).should.eql("1K");
    cli.toMagnitude(1075, 1024.0).should.eql("1K");
    cli.toMagnitude(1076, 1024.0).should.eql("1.1K");
    cli.toMagnitude(1000).should.eql("1K");
    cli.toMagnitude(1024).should.eql("1K");
    cli.toMagnitude(1075).should.eql("1.1K");

    cli.toMagnitude(9999, 1024.0).should.eql("9.8K");
    cli.toMagnitude(12345, 1024.0).should.eql("12K");
    cli.toMagnitude(123456, 1024.0).should.eql("121K");
    cli.toMagnitude(1024000, 1024.0).should.eql("1000K");
    cli.toMagnitude(1234567, 1024.0).should.eql("1.2M");
    cli.toMagnitude(74449000, 1024.0).should.eql("71M");

    cli.toMagnitude(Math.pow(2, 32), 1024.0).should.eql("4G");
    cli.toMagnitude(Math.pow(2, 64), 1024.0).should.eql("16E");
    cli.toMagnitude(Math.pow(10, 10)).should.eql("10G");
    cli.toMagnitude(Math.pow(10, 20)).should.eql("100E");
  });

  it("status line", () => {
    const s = new status.StatusUpdater({ width: 16, frequency: 100 });
    s.update("porky").should.eql("\r               \rporky");
    s.update("porky").should.eql("");
    s.update("wut?").should.eql("");
    s.lastUpdate -= 100;
    s.update().should.eql("\r               \rwut?");
    s.clear().should.eql("\r               \r");
    s.clear().should.eql("");
  });
});
