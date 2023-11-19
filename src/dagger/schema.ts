import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { upload } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("upload", {
      args: {
        src: stringArg(),
        token: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await upload(args.src || undefined, args.token),
    });
  },
});

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
