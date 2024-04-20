import Logger from "./Logger";
import Captcha from "./Captcha";
class PoliceBot {
  private cookie: string;
  private captcha: ICaptcha;
  private tempResponse: Response;

  readonly PoliceEndpoints: PoliceEndpointsCollection = {
    base: "https://www.csgt.vn",
    captcha: "/lib/captcha/captcha.class.php",
    search: "/",
  };

  async searchForViolations(
    vehicle: IVehicle
  ): Promise<IViolationSearchResult> {
    let violationSearchResult: IViolationSearchResult = {
      success: false,
      data: [],
    };

    try {
      // Try to get the captcha
      this.tempResponse = await this.makeRequestToPoliceServer({
        purpose: "captcha",
      });
      // If the response status is not 200, throw an error
      if (this.tempResponse.status !== 200) {
        this.throwError("Failed to fetch the captcha");
      }
      // If the response does not contain the cookie, throw an error  (this should not happen)
      if (this.tempResponse.headers.get("set-cookie") !== null) {
        this.cookie = this.tempResponse.headers.get("set-cookie")!;
      } else {
        this.throwError("Cookie not found");
      }
      // Store the captcha
      this.captcha = new Captcha(await this.tempResponse.arrayBuffer());

      // Try to search for the violation
      this.tempResponse = await this.makeRequestToPoliceServer({
        purpose: "violations",
        vehicle,
        captchaText: this.captcha.getText(),
      });

      Logger.log("Response status: " + this.tempResponse.status);

      Logger.log("Response content: " + (await this.tempResponse.json()));

      return violationSearchResult;
    } catch (error) {
      // if any error occurs, log the error and return the violation search result
      Logger.log(error);
      violationSearchResult.success = false;
      return violationSearchResult;
    }
  }

  private async makeRequestToPoliceServer(requestDetail: {
    purpose: "captcha" | "violations";
    vehicle?: IVehicle;
    captchaText?: string;
  }): Promise<Response> {
    switch (requestDetail.purpose) {
      case "captcha":
        return await fetch(
          this.PoliceEndpoints.base + this.PoliceEndpoints.captcha
        );
      case "violations":
        if (!requestDetail.vehicle || !requestDetail.captchaText) {
          console.log(requestDetail);
          this.throwError(
            "Must include vehicle and captcha text when search for violations"
          );
        }

        let options: RequestInit = {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Cookie: this.cookie,
          },
          body: `BienKS=${requestDetail.vehicle!.licensePlate}&Xe=${
            requestDetail.vehicle!.vehicleType
          }&captcha=${requestDetail.captchaText}&ipClient=9.9.9.91&cUrl=1`,
          method: "POST",
        };

        return await fetch(
          this.PoliceEndpoints.base + this.PoliceEndpoints.search,
          options
        );
    }
  }

  private throwError(message: string): void {
    throw new Error(message);
  }
}

export default PoliceBot;
