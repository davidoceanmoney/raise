import { createAuth } from "thirdweb/auth";
import { privateKeyAccount } from "thirdweb/wallets";
import { client } from "./client";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY || "";

if (!privateKey) {
  throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.");
}

export const thirdwebAuth = createAuth({
    domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
    adminAccount: privateKeyAccount({ client:client, privateKey }),
    client: client,
  });

