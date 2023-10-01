import { client } from "./dagger.ts";

export enum Job {
  upload = "upload",
}

export const exclude = [".devbox", "node_modules", ".fluentci"];

export const upload = async (src = ".", token?: string) => {
  const context = client.host().directory(src);
  if (!Deno.env.get("CODECOV_TOKEN") && !token) {
    console.log("CODECOV_TOKEN is not set. Skipping code coverage upload.");
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
    .withEnvVariable(
      "CODECOV_TOKEN",
      Deno.env.get("CODECOV_TOKEN") ? Deno.env.get("CODECOV_TOKEN")! : token!
    )
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

  return result.replace(/(\r\n|\n|\r)/gm, "");
};

export type JobExec = (src?: string) =>
  | Promise<string>
  | ((
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.upload]: upload,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.upload]: "Upload to Codecov",
};
