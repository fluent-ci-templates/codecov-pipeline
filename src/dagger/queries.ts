import { gql } from "../../deps.ts";

export const upload = gql`
  query Upload($src: String, $token: String!) {
    upload(src: $src, token: $token)
  }
`;
