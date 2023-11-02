import { JobSpec, Workflow } from "fluent_github_actions";

export function generateYaml(): Workflow {
  const workflow = new Workflow("Codecov");

  const push = {
    branches: ["main"],
  };

  const codecov: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v2",
      },
      {
        name: "Setup Fluent CI",
        uses: "fluentci-io/setup-fluentci@v1",
      },
      {
        name: "Upload Coverage",
        run: "fluentci run codecov_pipeline",
        env: {
          CODECOV_TOKEN: "${{ secrets.CODECOV_TOKEN }}",
        },
      },
    ],
  };

  workflow.on({ push }).jobs({ codecov });

  return workflow;
}
