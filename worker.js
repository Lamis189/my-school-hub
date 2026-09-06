export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/tutor" && request.method === "POST") {

      try {
        const data = await request.json();

        const question = data.question || 
          "Please explain this math question step by step.";

        const messages = [
          {
            role: "system",
            content:
              "You are Math Hub AI, a friendly high-school math tutor. Explain math clearly and step by step using simple language. Do not just give the answer; help the student understand."
          },
          {
            role: "user",
            content: question
          }
        ];

        const input = {
          messages: messages,

          chat_template_kwargs: {
            enable_thinking: false
          },

          max_tokens: 512
        };

        // Add the uploaded image if there is one
        if (data.image) {
          input.image = data.image;
        }

        const result = await env.AI.run(
          "@cf/google/gemma-4-26b-a4b-it",
          input
        );

        return Response.json(result, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        });

      } catch (error) {

        return Response.json(
          {
            error: error.message || "Unknown AI error"
          },
          {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
