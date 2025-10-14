import { Command } from "commander";

const argvs = new Command();

argvs.option("--mode <mode>", "to specify mode", "dev");
argvs.parse();

export default argvs.opts();
