class Vehicle implements IVehicle {
  licensePlate: VehicleLicensePlate;
  licensePlateColor: string;
  vehicleType: VehicleTypeCode;
  constructor(
    licensePlate: VehicleLicensePlate,
    licensePlateColor: string,
    vehicleType: VehicleTypeCode
  ) {
    this.licensePlate = licensePlate;
    this.licensePlateColor = licensePlateColor;
    this.vehicleType = vehicleType;
  }
}

export default Vehicle;
