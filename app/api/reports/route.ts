import { db } from "@/lib/db";

export let GET = async () => {
  let fetchedData = await db.injuryReport.findMany({});

  fetchedData = fetchedData.map((report) => ({
    ...report,
    reportDateTime: report.createdAt,
  }));

  return new Response(JSON.stringify(fetchedData));
};
