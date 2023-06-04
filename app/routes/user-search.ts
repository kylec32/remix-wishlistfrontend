import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";

export async function loader({ params }: LoaderArgs) {
    return new Response(JSON.stringify({key:'value'}), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    // return json({key:'value'});
  }