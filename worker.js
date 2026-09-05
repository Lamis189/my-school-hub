export default {
  async fetch(request, env) {
    // Allow your website to talk to the AI
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

    // AI Tutor endpoint
    if (url.pathname === "/api/tutor" && request.method === "POST") {
      try {
        const data = await request.json();

        const messages = [
          {
            role: "system",
            content:
              "You are a friendly AI math tutor for high school students. Explain answers clearly and step by step. Use simple language and help the student understand instead of only giving the answer."
          },
          {
            role: "user",
            content: data.question || "Please help me with this math question."
          }
        ];

        const input = {
          messages
        };

        // If the student uploaded an image, send it to the vision model
        if (data.image) {
          input.image = data.image;
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.2-11b-vision-instruct",
          input
        );

        return Response.json(result, {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error) {
        return Response.json(
          {
            error: "Something went wrong with the AI Tutor."
          },
          {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }

    // Show the normal website
    return env.ASSETS.fetch(request);
  }
};
