export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Allow browser requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);

    // AI Tutor endpoint
    if (url.pathname === "/api/tutor" && request.method === "POST") {
      try {
        const data = await request.json();

        const question =
          data.question ||
          "Please solve the math problem in this image and explain it step by step.";

        // Build the user's message
        const userContent = [
          {
            type: "text",
            text: question
          }
        ];

        // Add the uploaded image
        if (data.image) {
          userContent.push({
            type: "image_url",
            image_url: {
              url: data.image
            }
          });
        }

        // Ask Gemma 4
        const result = await env.AI.run(
          "@cf/google/gemma-4-26b-a4b-it",
          {
            messages: [
              {
                role: "system",
                content:
                  "You are Math Hub AI, a friendly high-school math tutor. " +
                  "If an image is provided, carefully read the math problem in the image. " +
                  "Explain the solution clearly and step by step using simple language. " +
                  "Do not just give the final answer. Help the student understand each step."
              },
              {
                role: "user",
                content: userContent
              }
            ],

            chat_template_kwargs: {
              enable_thinking: false
            },

            max_tokens: 512
          }
        );

        // Send the AI result back to the website
        return Response.json(result, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });

      } catch (error) {
        console.error("AI Tutor Error:", error);

        return Response.json(
          {
            error: error?.message || "Unknown AI error"
          },
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    // Serve the website normally
    return env.ASSETS.fetch(request);
  }
};
