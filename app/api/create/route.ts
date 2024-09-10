import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export let POST = async (request: NextRequest) => {
  let body = await request.json();

  let { reporterName, injuryDateTime, injuries } = body;

  try {
    // creating the report

    let createdReport = await db.injuryReport.create({
      data: {
        reporterName,
        injuryDateTime: new Date(injuryDateTime),
        injuries: {
          create: injuries.map((injury: any) => ({
            x: injury.x,
            y: injury.y,
            bodyPart: injury.bodyPart || "",
            details: injury.details,
          })),
        },
      },
    });

    return new Response(JSON.stringify(createdReport));
  } catch (err) {
    return new Response("Could not create the report", {
      status: 500,
    });
  }
};
