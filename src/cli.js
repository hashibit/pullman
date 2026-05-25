#!/usr/bin/env node
import { program } from "commander";
import { registerGetcontent } from "./commands/getcontent.js";

program
  .name("getweb")
  .description("Scrape web articles into structured Markdown archives")
  .version("1.0.0");

registerGetcontent(program);

program.parse();
