import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export let GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  let fetchedData = await db.injuryReport.findFirst({
    where: {
      id: Number(params.id),
    },
    include: {
      injuries: {
        select: {
          id: true,
          x: true,
          y: true,
          details: true,
        },
      },
    },
  });
  return new Response(JSON.stringify(fetchedData));
};

export let DELETE = async (
  request: NextRequest,
  { params }: { params: { id: String } }
) => {
  console.log(params.id);
  await db.injuryReport.delete({
    where: {
      id: Number(params.id),
    },
  });

  return new Response("Successully deleted", { status: 200 });
};

export let POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  let body = await request.json();

  await db.injury.deleteMany({
    where: {
      reportId: Number(params.id), // Ensure we're deleting injuries tied to this report
    },
  });

  let { reporterName, injuryDateTime, injuries } = body;

  let updatedReport = await db.injuryReport.update({
    where: {
      id: Number(params.id),
    },
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

  return new Response(JSON.stringify(updatedReport));
};
