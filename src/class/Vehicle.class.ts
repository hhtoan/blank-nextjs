class Vehicle implements IVehicle {
  licensePlate: VehicleLicensePlate;
  licensePlateColor: string;
  vehicleType: VehicleType;
  constructor(
    licensePlate: VehicleLicensePlate,
    licensePlateColor: string,
    vehicleType: VehicleType
  ) {
    this.licensePlate = licensePlate;
    this.licensePlateColor = licensePlateColor;
    this.vehicleType = vehicleType;
  }
}

export default Vehicle;
