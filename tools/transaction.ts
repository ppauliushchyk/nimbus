/* eslint-disable no-console */

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
    console.log("Making a 2000 USD deposit...");

    await fetch("http://localhost:3000/api/deposit", {
      body: JSON.stringify({ amount: "2000" }),
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      method: "POST",
    });

    console.log("Calling API 10x...");

    const result = await Promise.all(
      Array.from({ length: 10 }).map(() => fetch("http://localhost:3000/api/withdraw", {
        body: JSON.stringify({ amount: "1000" }),
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        method: "POST",
      })),
    );

    result.forEach(async (item, index) => {
      const { data } = await item.json();

      console.log(`Response #${index}: `, data);
    });
  }
}

main().catch(() => {
  process.exit(1);
});
