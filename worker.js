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

        const question =
          data.question ||
          "Please solve the math problem in the image and explain it step by step.";

        let userContent = [
          {
            type: "text",
            text: question
          }
        ];

        // Add the uploaded image directly to the user's message
        if (data.image) {
          userContent.push({
            type: "image",
            url: data.image
          });
        }

        const messages = [
          {
            role: "system",
            content:
              "You are Math Hub AI, a friendly high-school math tutor. If an image is provided, carefully read the math problem in the image. Explain the solution clearly and step by step using simple language. Do not just give the final answer."
          },
          {
            role: "user",
            content: userContent
          }
        ];

        const result = await env.AI.run(
          "@cf/google/gemma-4-26b-a4b-it",
          {
            messages: messages,

            chat_template_kwargs: {
              enable_thinking: false
            },

            max_tokens: 512
          }
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
