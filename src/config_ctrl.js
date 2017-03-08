export class SkydiveConfigCtrl {

  /** @ngInject */
  constructor($scope) {
    this.scope = $scope;

    this.versionFields = [
      {text: "0.9.x", value: "0.9"},
      {text: ">= 0.10.x", value: "0.10"}
    ];

     this.current.jsonData.version = this.current.jsonData.version || this.versionFields[0].value;
  }

  versionChanged() {
    console.log(this.current.jsonData.version);
  }
}

SkydiveConfigCtrl.templateUrl = 'partials/config.html';
