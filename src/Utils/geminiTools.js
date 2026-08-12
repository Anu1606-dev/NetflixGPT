export const GEMINI_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "recommend_movies",
        description:
          "Recommend a list of exactly 5 real movies to the user based on their mood, genre, or request. " +
          "Use this whenever the user wants recommendations, suggestions, or multiple movies — including refinements " +
          "of an earlier recommendation (e.g. 'funnier', 'shorter').",
        parameters: {
          type: "OBJECT",
          properties: {
            movie_titles: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "Exactly 5 real movie titles that match the user's request.",
            },
          },
          required: ["movie_titles"],
        },
      },
      {
        name: "get_movie_details",
        description:
          "Get detailed information about ONE specific movie or show the user is asking about by name " +
          "(plot, cast, trailer, rating, release info, 'tell me about X', 'what's X about'). " +
          "Use this only when the user is clearly asking about a single specific title, not a list.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: {
              type: "STRING",
              description: "The exact title of the movie or show the user is asking about.",
            },
          },
          required: ["title"],
        },
      },
    ],
  },
];