/* eslint-disable no-console */

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function main() {
  console.log("Authorising...");
  const { headers } = await fetch("http://localhost:3000/api/account/login", {
    body: JSON.stringify({ id: "6750ce0d3311469c225e256c" }),
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  console.log("Authorised");

  const cookie = headers.get("Set-Cookie");

  if (cookie) {
    for (let i = 0; i < 1000; i += 1) {
      console.log("Making a 100 USD deposit...");
      await fetch("http://localhost:3000/api/deposit", {
        body: JSON.stringify({ amount: "100" }),
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        method: "POST",
      });

      console.log("Made a 100 USD deposit...");

      await delay(1000);
    }
  }
}

main().catch(() => {
  process.exit(1);
});
