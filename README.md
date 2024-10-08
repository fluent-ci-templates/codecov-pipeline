# Codecov Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/codecov_pipeline)](https://pkg.fluentci.io/codecov_pipeline)
[![deno module](https://shield.deno.dev/x/codecov_pipeline)](https://deno.land/x/codecov_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/codecov)](https://jsr.io/@fluentci/codecov)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/codecov-pipeline)](https://codecov.io/gh/fluent-ci-templates/codecov-pipeline)

A ready-to-use CI/CD Pipeline that uploads coverage to [Codecov](https://about.codecov.io/) ☂️.

![Made with VHS](https://vhs.charm.sh/vhs-bEdRHI7ddO3h0UffaWJWd.gif)

## 🚀 Usage

Run the following command:

```bash
fluentci run codecov_pipeline
```

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger install github.com/fluent-ci-templates/codecov-pipeline@main
```

Call `upload` function with the following command:

```bash
dagger call upload --src . --token CODECOV_TOKEN
```

## 🛠️ Environment Variables

| Variable      | Description         | Usage    |
|---------------|---------------------|----------|
| CODECOV_TOKEN | Your Codecov token. | Required |
| CODECOV_URL   | Your Codecov URL.   | Optional |
| COVERAGE_FILE | Your coverage file. | Optional |

## ✨ Jobs

| Job     | Description                      |
|---------|----------------------------------|
| upload  | Uploads coverage to Codecov.     |

```typescript
upload(
  src: string | Directory,
  token: string | Secret
): Promise<string>
```

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { upload } from "jsr:@fluentci/codecov";

await upload();
```
