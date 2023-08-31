import { Client } from "@dagger.io/dagger";

export enum Job {
  upload = "upload",
}

export const upload = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  if (!Deno.env.get("CODECOV_TOKEN")) {
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
    .withDirectory("/app", context, {
      exclude: [".devbox", "node_modules", ".fluentci"],
    })
    .withWorkdir("/app")
    .withEnvVariable("CODECOV_TOKEN", Deno.env.get("CODECOV_TOKEN")!)
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
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.upload]: upload,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.upload]: "Upload to Codecov",
};
