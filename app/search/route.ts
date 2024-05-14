import PoliceBot from "../../src/class/PoliceBot.class";
import Vehicle from "../../src/class/Vehicle.class";

export async function GET(request: Request) {
  // get the request query params
  const url = new URL(request.url);
  const params = url.searchParams;

  const policeBot = new PoliceBot();
  const vehicle = new Vehicle(params.get("bks"), "blue", {
    text: "Ô tô",
    code: 1,
  });
  const data = await policeBot.searchForViolations(vehicle).then((result) => {
    return result;
  });

  return Response.json(
    data /* , {
    headers: {
      "Cache-Control": "no-cache",
    },
  } */
  );
}
