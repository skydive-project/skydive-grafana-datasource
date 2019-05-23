export class SkydiveConfigCtrl {

  /** @ngInject */
  constructor($scope) {
    this.scope = $scope;

    this.versionFields = [
      { text: ">= 0.23", value: "0.23" },
      { text: ">= 0.22", value: "0.22" },
      { text: ">= 0.10", value: "0.10" },
      { text: "0.9", value: "0.9" }
    ];

    this.current.jsonData.version = this.current.jsonData.version || this.versionFields[0].value;
  }

  versionChanged() {
    console.log(this.current.jsonData.version);
  }
}

SkydiveConfigCtrl.templateUrl = 'partials/config.html';
