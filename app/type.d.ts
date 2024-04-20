type VehicleLicensePlate = string;
type VehicleTypeText = "Ô tô" | "Xe máy" | "Xe đạp điện";
type VehicleTypeCode = 1 | 2 | 3;
type SanctionStatus = "Đã xử phạt" | "Chưa xử phạt";

interface IVehicle {
  licensePlate: VehicleLicensePlate;
  licensePlateColor: string;
  vehicleType: VehicleTypeCode;
}

interface PoliceEndpointsCollection {
  base: string;
  captcha: string;
  search: string;
}

interface IViolation {
  licensePlate: VehicleLicensePlate;
  licensePlateColor: string;
  vehicleType: VehicleTypeText;
  violationTime: string;
  violationLocation: string;
  violation: string;
  sanctionStatus: SanctionStatus;
  unitDetectingViolations: string;
  placeToResolveViolations: string;
}

interface IViolationSearchResult {
  success: boolean;
  data: Array<IViolation>;
}

interface ICaptcha {
  getText: () => string;
  getImageBuffer: () => Buffer;
}
