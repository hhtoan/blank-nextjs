import { parse } from "node-html-parser";

class SearchResultParser {
  static readonly keyMapping = {
    "Biển kiểm soát": "licensePlate",
    "Màu biển": "licensePlateColor",
    "Loại phương tiện": "vehicleTypeText",
    "Thời gian vi phạm": "violationTime",
    "Địa điểm vi phạm": "violationLocation",
    "Hành vi vi phạm": "violationDetail",
    "Trạng thái": "sanctionStatus",
    "Đơn vị phát hiện vi phạm": "unitDetectingViolations",
    "Nơi giải quyết vụ việc": "placeToResolveViolations",
    "Tên địa điểm": "placeName",
    "Địa chỉ": "placeAddress",
    "Số điện thoại liên hệ": "placeContactPhone",
  };

  static fromHTML(html: string): Array<IViolation> {
    const document = parse(html);
    const result = document.querySelector("#bodyPrint123");

    // if the result is empty, return an empty array
    if (
      result.innerText.trim() === "" ||
      result.innerText.trim() === "Không tìm thấy kết quả !"
    ) {
      return [];
    }
    let arr = Array.from(result.querySelectorAll("div.form-group,hr"))
      .map((e) => this.prettyString(e.innerText))
      .map((e) => e.split(/\s{3,}/));
    return this.parseArray(arr);
  }

  static prettyString(str: string) {
    return str.replace(/(\r\n|\n|\r|:$)/gm, "").trim();
  }
  static parseArray(arr: Array<Array<string>>): Array<IViolation> {
    let result: Array<IViolation> = [];
    let tempViolation: IViolation = {
      licensePlate: "",
      licensePlateColor: "",
      vehicleTypeText: "",
      violationTime: "",
      violationLocation: "",
      violationDetail: "",
      sanctionStatus: "",
      unitDetectingViolations: "",
      placeToResolveViolations: [],
    };

    let tempPlaceToResolveViolations: IPlaceToResolveViolations = {
      placeName: "",
      placeContactPhone: "",
      placeAddress: "",
    };

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length === 2) {
        tempViolation[this.keyMapping[this.prettyString(arr[i][0])]] =
          this.prettyString(arr[i][1]);
      } else {
        if (arr[i][0] === "") {
          result.push(tempViolation);
          tempViolation = {
            licensePlate: "",
            licensePlateColor: "",
            vehicleTypeText: "",
            violationTime: "",
            violationLocation: "",
            violationDetail: "",
            sanctionStatus: "",
            unitDetectingViolations: "",
            placeToResolveViolations: [],
          };
        } else {
          if (this.prettyString(arr[i][0]) === "Nơi giải quyết vụ việc") {
            continue;
          }
          let { type, value } = this.parseLocation(
            this.prettyString(arr[i][0])
          );
          switch (type) {
            case "Tên địa điểm":
              tempPlaceToResolveViolations[this.keyMapping["Tên địa điểm"]] =
                value;
              tempViolation[this.keyMapping["Nơi giải quyết vụ việc"]].push(
                tempPlaceToResolveViolations
              );
              tempPlaceToResolveViolations = {
                placeName: "",
                placeContactPhone: "",
                placeAddress: "",
              };
              break;
            case "Địa chỉ:":
              tempViolation[this.keyMapping["Nơi giải quyết vụ việc"]][
                tempViolation[this.keyMapping["Nơi giải quyết vụ việc"]]
                  .length - 1
              ][this.keyMapping["Địa chỉ"]] = value;
              break;
            case "Số điện thoại liên hệ":
              tempViolation[this.keyMapping["Nơi giải quyết vụ việc"]][
                tempViolation[this.keyMapping["Nơi giải quyết vụ việc"]]
                  .length - 1
              ][this.keyMapping["Số điện thoại liên hệ"]] = value;
              break;
          }
        }
      }
    }
    return result;
  }
  static parseLocation(str: string) {
    let a: Array<string> | null;
    if (((a = str.match(/(\d\.\s)(.+)/)), a !== null)) {
      return { type: "Tên địa điểm", value: a[2] };
    }
    if (((a = str.match(/(Địa chỉ:\s)(.+)/)), a !== null)) {
      return { type: "Địa chỉ:", value: a[2] };
    }
    if (((a = str.match(/(Số điện thoại liên hệ:\s)(.+)/)), a !== null)) {
      return { type: "Số điện thoại liên hệ", value: a[2] };
    }
  }
}

export default SearchResultParser;
