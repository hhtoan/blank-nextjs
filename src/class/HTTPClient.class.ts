import Logger from "./Logger.class";

export default class HTTPClient {
  private cookie: string;
  private readonly PoliceEndpoints: PoliceEndpointsCollection = {
    base: "https://www.csgt.vn",
    captcha: "/lib/captcha/captcha.class.php",
    search: "/?mod=contact&task=tracuu_post&ajax",
    result: "/tra-cuu-phuong-tien-vi-pham.html",
  };
  private response: Response;

  async getCaptcha(): Promise<Response> {
    this.response = await fetch(
      this.PoliceEndpoints.base + this.PoliceEndpoints.captcha
      /* ,
              { cache: "no-store" } */
    );
    // If the this.response status is not 200, throw an error
    if (this.response.status !== 200) {
      Logger.throwError("Failed to fetch the captcha");
    }

    // If the this.response does not contain the cookie, throw an error  (this should not happen)
    if (this.response.headers.get("set-cookie") !== null) {
      this.cookie = this.response.headers.get("set-cookie")!;
    } else {
      Logger.throwError("Cookie not found");
    }
    return this.response;
  }

  async submitCaptcha(
    captchaText: string,
    vehicle: IVehicle
  ): Promise<Response> {
    Logger.log(captchaText);
    Logger.log(this.cookie);

    let options: RequestInit = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Cookie: this.cookie,
      },
      body: `BienKS=${vehicle!.licensePlate}&Xe=${
        vehicle!.vehicleType
      }&captcha=${captchaText}&ipClient=9.9.9.91&cUrl=1`,
      method: "POST",
    };

    this.response = await fetch(
      this.PoliceEndpoints.base + this.PoliceEndpoints.search,
      options
    );

    // If the response content is 404, throw an error for invalid captcha
    if ((await this.response.text()).includes("404")) {
      Logger.throwError("Invalid captcha");
    }

    return this.response;
  }

  async getViolations(vehicle: IVehicle): Promise<Response> {
    const searchParams = new URLSearchParams([
      ["LoaiXe", vehicle.vehicleType.toString()],
      ["BienKiemSoat", vehicle.licensePlate],
    ]);

    return await fetch(
      this.PoliceEndpoints.base +
        this.PoliceEndpoints.result +
        "?&" +
        searchParams.toString(),
      {
        headers: {
          Cookie: this.cookie,
        },
      }
    );
  }
}
