/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  return Response.json({ success: true, data: "THANK YOU!" }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { type, role, level, techstack, amount, userid } = body;

    // Validate required fields
    if (!type || !role || !level || !techstack || !amount || !userid) {
      console.error("Missing required fields:", {
        type,
        role,
        level,
        techstack,
        amount,
        userid,
      });
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // AI text generation
      console.log("Generating questions with AI...");
      const { text: questions } = await generateText({
        model: google("gemini-1.5-pro"),
        prompt: `Prepare questions for a job interview.
          The job role is ${role}.
          The job experience level is ${level}.
          The tech stack used in the job is ${techstack}.
          The focus between behavioural and technical questions should lean toward: ${type}.
          The amount of questions required is: ${amount}.
          Please return only the quesions, without any additional text.
          The questions are going to be read by a voice assistant so do not use "/" or "*" or and other special characters which might break the voice assistant.
          Return the questions formatted like this:
          ["Questions 1", "Questions 2", "Questions 3"]

          Thank you! <3
          `,
      });

      // Safely parse JSON
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(questions);
        console.log("Successfully parsed questions");
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", questions);
        return Response.json(
          { success: false, message: "AI returned invalid JSON format" },
          { status: 500 }
        );
      }

      // Create and save document
      const interview = {
        role,
        type,
        level,
        techstack: techstack.split(","),
        questions: parsedQuestions,
        userId: userid,
        finalized: true,
        coverImage: getRandomInterviewCover(),
        createdAt: new Date().toISOString(),
      };

      // Database operation
      console.log("Saving interview to database...");
      await db.collection("interviews").add(interview);
      console.log("Interview saved successfully");

      return Response.json({ success: true }, { status: 200 });
    } catch (operationError) {
      console.error("Operation error:", operationError);
      const errorMessage =
        operationError &&
        typeof operationError === "object" &&
        "message" in operationError
          ? (operationError.message as string)
          : "Unknown error occurred";
      return Response.json(
        { success: false, message: errorMessage },
        { status: 500 }
      );
    }
  } catch (requestError) {
    console.error("Request parsing error:", requestError);
    return Response.json(
      { success: false, message: "Invalid request data" },
      { status: 400 }
    );
  }
}
