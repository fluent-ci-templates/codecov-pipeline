import Client, { Directory, Secret } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory, getCodecovToken } from "./lib.ts";

export enum Job {
  upload = "upload",
}

export const exclude = [".devbox", "node_modules", ".fluentci"];

/**
 * @function
 * @description Uploads code coverage to Codecov
 * @param {string} src
 * @param {string} token
 * @returns {string}
 */
export async function upload(
  src: string | Directory,
  token: string | Secret
): Promise<string> {
  await connect(async (client: Client) => {
    const context = await getDirectory(client, src);
    const secret = await getCodecovToken(client, token);
    if (!secret) {
      console.error("CODECOV_TOKEN is not set. Skipping code coverage upload.");
      Deno.exit(1);
    }

    const ctr = client
      .pipeline(Job.upload)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "curl", "git"])
      .withExec([
        "curl",
        "-Os",
        "https://uploader.codecov.io/latest/alpine/codecov",
      ])
      .withExec(["chmod", "a+x", "codecov"])
      .withExec(["mv", "codecov", "/usr/local/bin/codecov"])
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withSecretVariable("CODECOV_TOKEN", secret)
      .withEnvVariable("CODECOV_URL", Deno.env.get("CODECOV_URL") || "")
      .withExec(["ls", "-la"])
      .withExec([
        "sh",
        "-c",
        `codecov -t $CODECOV_TOKEN ${
          Deno.env.get("CODECOV_URL") ? `--url $CODECOV_URL` : ""
        } ${
          Deno.env.get("COVERAGE_FILE")
            ? `-f ${Deno.env.get("COVERAGE_FILE")}`
            : ""
        }`,
      ]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Codecov upload complete.";
}

export type JobExec = (
  src: string | Directory,
  token: string | Secret
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.upload]: upload,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.upload]: "Upload to Codecov",
};
