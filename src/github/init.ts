import { generateYaml } from "./config.ts";

generateYaml().save(".github/workflows/codecov-upload.yml");
