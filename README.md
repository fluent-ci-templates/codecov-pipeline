# Codecov Pipeline

[![deno module](https://shield.deno.dev/x/codecov_pipeline)](https://deno.land/x/codecov_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/codecov-pipeline)](https://codecov.io/gh/fluent-ci-templates/codecov-pipeline)


A ready-to-use CI/CD Pipeline that uploads coverage to [Codecov](https://about.codecov.io/) ☂️.


## 🚀 Usage

Run the following command:

```bash
dagger run fluentci codecov_pipeline
```

## Environment Variables

| Variable      | Description                    |
|---------------|--------------------------------|
| CODECOV_TOKEN | Your Codecov token. (required) |
| CODECOV_URL   | Your Codecov URL.  (optional)  |

## Jobs

| Job     | Description                      |
|---------|----------------------------------|
| upload  | Uploads coverage to Codecov.     |

## Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/codecov_pipeline/mod.ts";

const { upload } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await upload(client, src);
  });
}

pipeline();

```
