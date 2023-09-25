import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import { upload } from "https://deno.land/x/codecov_pipeline/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await upload(client, src);
  });
}

pipeline();
