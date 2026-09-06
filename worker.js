export default {
  async fetch(request, env) {

    // Allow the website to communicate with the AI
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

    // AI Tutor
    if (url.pathname === "/api/tutor" && request.method === "POST") {

      try {
        const data = await request.json();

        const question =
          data.question ||
          "Please help me with this math question.";

        const messages = [
          {
            role: "system",
            content:
              "You are a friendly AI math tutor for high school students. Explain math clearly and step-by-step using simple language. Help the student understand the answer."
          },
          {
            role: "user",
            content: question
          }
        ];

        let result;

        // --------------------------------------
        // If there is an image, use Vision AI
        // --------------------------------------

        if (data.image) {

          result = await env.AI.run(
            "@cf/meta/llama-3.2-11b-vision-instruct",
            {
              messages: messages,
              image: data.image
            }
          );

        } else {

          // --------------------------------------
          // Normal text question
          // --------------------------------------

          result = await env.AI.run(
            "@cf/meta/llama-3.2-3b-instruct",
            {
              messages: messages,
              max_tokens: 512
            }
          );
        }

        return Response.json(result, {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (error) {

        console.error("AI ERROR:", error);

        return Response.json(
          {
            error:
              "AI error: " +
              (error.message || "Unknown error")
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
