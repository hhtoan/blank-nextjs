import PoliceBot from "./PoliceBot";
import Vehicle from "./Vehicle";

const policeBot = new PoliceBot();

const vehicle = new Vehicle("88A40547", "blue", 1);

export default function Page() {
  policeBot.searchForViolations(vehicle).then((result) => {
    console.log(result);
  });
  return <h1>Hello, Next.js!</h1>;
}
