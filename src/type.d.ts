type VehicleLicensePlate = string;
type VehicleTypeText = "Ô tô" | "Xe máy" | "Xe đạp điện";
type VehicleTypeCode = 1 | 2 | 3;

type VehicleType = {
  text: VehicleTypeText;
  code: VehicleTypeCode;
};

type SanctionStatus = "Đã xử phạt" | "Chưa xử phạt";

interface IVehicle {
  licensePlate: VehicleLicensePlate;
  licensePlateColor: string;
  vehicleType: VehicleType;
}

interface PoliceEndpointsCollection {
  base: string;
  captcha: string;
  search: string;
  result: string;
}

interface IViolation {
  licensePlate: VehicleLicensePlate;
  licensePlateColor: string;
  vehicleTypeText: VehicleTypeText | "";
  violationTime: string;
  violationLocation: string;
  violationDetail: string;
  sanctionStatus: SanctionStatus | "";
  unitDetectingViolations: string;
  placeToResolveViolations: Array<any>;
}

interface IPlaceToResolveViolations {
  placeName: string;
  placeContactPhone: string;
  placeAddress: string;
}

interface IViolationSearchResult {
  success: boolean;
  data: Array<IViolation>;
  msg: string;
}

interface ICaptchaSolver {
  getText: () => Promise<string>;
  getImageBuffer: () => Buffer;
}
