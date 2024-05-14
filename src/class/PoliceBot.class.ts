import Logger from "./Logger.class";
import CaptchaSolver from "./CaptchaSolver.class";
import SearchResultParser from "./SearchResultParser.class";
import HTTPClient from "./HTTPClient.class";

class PoliceBot {
  private captcha: ICaptchaSolver;
  private reponse: Response;
  private readonly httpClient: HTTPClient = new HTTPClient();

  async searchForViolations(
    vehicle: IVehicle
  ): Promise<IViolationSearchResult> {
    let violationSearchResult: IViolationSearchResult = {
      success: false,
      data: [],
      msg: "",
    };

    try {
      // Try to get the captcha
      this.reponse = await this.httpClient.getCaptcha();

      // Store the captcha
      this.captcha = new CaptchaSolver(await this.reponse.arrayBuffer());

      // Try to submit the captcha
      this.reponse = await this.httpClient.submitCaptcha(
        await this.captcha.getText(),
        vehicle
      );

      // Now parse the result
      this.reponse = await this.httpClient.getViolations(vehicle);

      violationSearchResult.success = true;
      violationSearchResult.data = SearchResultParser.fromHTML(
        await this.reponse.text()
      );

      return violationSearchResult;
    } catch (error) {
      // if any error occurs, log the error and return the violation search result
      Logger.log(error);
      violationSearchResult.success = false;
      violationSearchResult.msg = error.message;
      return violationSearchResult;
    }
  }
}

export default PoliceBot;
