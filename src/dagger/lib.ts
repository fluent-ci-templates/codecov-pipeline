import Client, {
  Directory,
  DirectoryID,
  Secret,
  SecretID,
} from "../../deps.ts";

export const getDirectory = (
  client: Client,
  src: string | Directory | undefined = "."
) => {
  if (typeof src === "string" && src.startsWith("core.Directory")) {
    return client.directory({
      id: src as DirectoryID,
    });
  }
  return src instanceof Directory ? src : client.host().directory(src);
};

export const getCodecovToken = (client: Client, token?: string | Secret) => {
  if (Deno.env.get("CODECOV_TOKEN")) {
    return client.setSecret("CODECOV_TOKEN", Deno.env.get("CODECOV_TOKEN")!);
  }
  if (token && typeof token === "string") {
    if (token.startsWith("core.Secret")) {
      return client.loadSecretFromID(token as SecretID);
    }
    return client.setSecret("CODECOV_TOKEN", token);
  }
  if (token && token instanceof Secret) {
    return token;
  }
  return undefined;
};
