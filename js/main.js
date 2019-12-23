var app = angular.module('Insurance', ['ui.router']);
app.controller('mainController', function($scope, $state, $timeout, $rootScope) {
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            $timeout(function() {
                if ($state.current.name == "Payment")
                    $scope.heading = "Payment";
                else if ($state.current.name == "Personal")
                    $scope.heading = "Personal";
                else if ($state.current.name == "BuyInsurance")
                    $scope.heading = "Buy Insurance";
                else {
                    $scope.heading = "";
                }
            }, 500)
        })
})
app.controller('PersonalController', function($scope, $state, $stateParams) {
    $scope.premium = $stateParams.premium;
    $scope.pay = function() {
        Swal.fire({
            title: 'Do you want to proceed to pay?',
            text: "Your Insurance premium per month is ₹" + $scope.premium,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Proceed'
        }).then((result) => {
            if (result.value) {
                Swal.fire('Success', 'Payment Successfull', 'success');
                $state.go("Payment", {
                    premium: $scope.premium
                });
            }
        })
    }
    $scope.clear=function()
    {
      $scope.dob=null;
      $scope.occupation=null;
      $scope.weight=null;
      $scope.height=null;
      $scope.height=null;
      $scope.health_condition=null;
    }
});
app.controller('BuyInsuranceController', function($scope, $state, COUNTRY_CODE) {
    $scope.country_code_dropdown = COUNTRY_CODE;
    $scope.insurance_for_dropdown = [{
            'key': '1',
            'value': 'Self'
        },
        {
            'key': '2',
            'value': 'Spouse'
        },
        {
            'key': '3',
            'value': 'Son'
        },
        {
            'key': '4',
            'value': 'Daughter'
        }
    ];
    $scope.clear = function() {
        $scope.insurance_for = null;
        $scope.fname = null;
        $scope.lname = null;
        $scope.gender = null;
        $scope.age = null;
        $scope.country_code = null;
        $scope.phno = null;
        $scope.city = null;
        $scope.email = null;
        $scope.smoking = null;

    }
    $scope.get_quote = function() {
        if ($scope.age < 20) {
            Swal.fire('Warning', 'No insurance premium available at this age', 'warning');
        } else {
            var premium_pre = ($scope.age - 20) * 2;
            if($scope.smoking==undefined || $scope.smoking==false)
              $scope.premium = 2000 + 2000 * premium_pre / 100;
            else {
              $scope.premium = 2000 + 2000 * premium_pre / 100;
              $scope.premium +=$scope.premium*0.12;
            }
            Swal.fire({
                title: 'Do you want to proceed?',
                text: "Your Insurance premium per month is ₹" + $scope.premium,
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Proceed'
            }).then((result) => {
                if (result.value) {
                    $state.go("Personal", {
                        premium: $scope.premium
                    });
                }
            })
        }
    }
});
app.controller('PaymentController', function($scope, $http, $stateParams) {
    $scope.rupee_range = 50;
    $scope.gbp_range = 50;
    // $stateParams.premium = 2200;
    $scope.premium = $stateParams.premium;

    $http.get("https://api.exchangeratesapi.io/latest?symbols=INR")
        .then(function(response) {
            $scope.rate = response.data.rates.INR;
            $scope.premium_rupees = $stateParams.premium / 2.0;
            $scope.premium_gbp = (($stateParams.premium / 2.0) / $scope.rate).toFixed(2);
            $scope.discount = 10;
            $scope.payable_rupees = ($scope.premium_rupees - $scope.premium_rupees * 0.1).toFixed(2);
            $scope.payable_gbp = ($scope.premium_gbp - $scope.premium_gbp * 0.1).toFixed(2);
            $scope.payable_premium = ($scope.premium - $scope.premium * 0.1).toFixed(2);

        });
    $scope.calculateDiscount = function() {
        $scope.rupee_range = $scope.slider_range;
        $scope.gbp_range = 100 - $scope.slider_range;
        $scope.premium_rupees = $stateParams.premium * $scope.rupee_range / 100;
        $scope.premium_gbp = (($stateParams.premium * $scope.gbp_range / 100) / $scope.rate).toFixed(2);
        $scope.discount = (10 - Math.abs($scope.rupee_range - $scope.gbp_range) / 10).toFixed(2);
        $scope.payable_rupees = ($scope.premium_rupees - $scope.premium_rupees * $scope.discount / 100).toFixed(2);
        $scope.payable_gbp = ($scope.premium_gbp - $scope.premium_gbp * $scope.discount / 100).toFixed(2);
        $scope.payable_premium = ($scope.premium - $scope.premium * $scope.discount / 100).toFixed(2);
    }
    $scope.finalPay = function() {
        Swal.fire('Success', 'Payment Successfull', 'success')
    }
});
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
        })
        .state('BuyInsurance', {
            url: '/BuyInsurance',
            templateUrl: 'BuyInsurance.html',
            controller: 'BuyInsuranceController',
        })
        .state('Personal', {
            url: '/Personal',
            templateUrl: 'Personal.html',
            controller: 'PersonalController',
            params: {
                premium: null
            }
        })
        .state('Payment', {
            url: '/Payment',
            templateUrl: 'Payment.html',
            controller: 'PaymentController',
            params: {
                premium: null
            }
        })

});
// app.constant('COUNTRY_CODE', [93, 355, 213, 1 - 684, 376, 244, 1 - 264, 672, 1 - 268, 54, 374, 297, 61, 43, 994, 1 - 242, 973, 880, 1 - 246, 375, 32, 501, 229, 1 - 441, 975, 591, 387, 267, 55, 246, 1 - 284, 673, 359, 226, 257, 855, 237, 1,
//     238, 1 - 345, 236, 235, 56, 86, 61, 61, 57, 269, 682, 506, 385, 53, 599, 357, 420, 243, 45, 253, 1 - 767, 1 - 809, 1 - 829, 1 - 849, 670, 593, 20, 503, 240, 291, 372, 251, 500, 298, 679, 358, 33, 689, 241, 220, 995, 49, 233, 350,
//     30, 299, 1 - 473, 1 - 671, 502, 44 - 1481, 224, 245, 592, 509, 504, 852, 36, 354, 91, 62, 98, 964, 353, 44 - 1624, 972, 39, 225, 1 - 876, 81, 44 - 1534, 962, 7, 254, 686, 383, 965, 996, 856, 371, 961, 266, 231, 218, 423, 370, 352,
//     853, 389, 261, 265, 60, 960, 223, 356, 692, 222, 230, 262, 52, 691, 373, 377, 976, 382, 1 - 664, 212, 258, 95, 264, 674, 977, 31, 599, 687, 64, 505, 227, 234, 683, 850, 1 - 670, 47, 968, 92, 680, 970, 507, 675, 595, 51, 63, 64,
//     48, 351, 1 - 787, 1 - 939, 974, 242, 262, 40, 7, 250, 590, 290, 1 - 869, 1 - 758, 590, 508, 1 - 784, 685, 378, 239, 966, 221, 381, 248, 232, 65, 1 - 721, 421, 386, 677, 252, 27, 82, 211, 34, 94, 249, 597, 47, 268, 46, 41, 963,
//     886, 992, 255, 66, 228, 690, 676, 1 - 868, 216, 90, 993, 1 - 649, 688, 1 - 340, 256, 380, 971, 44, 1, 598, 998, 678, 379, 58, 84, 681, 212, 967, 260, 263
// ]);
app.constant('COUNTRY_CODE',
[{
"Name": "Afghanistan",
"ISO": "af",
"Code": "+93"
},
{
"Name": "Albania",
"ISO": "al",
"Code": "+355"
},
{
"Name": "Algeria",
"ISO": "dz",
"Code": "+213"
},
{
"Name": "American Samoa",
"ISO": "as",
"Code": "+1684"
},
{
"Name": "Andorra",
"ISO": "ad",
"Code": "+376"
},
{
"Name": "Angola",
"ISO": "ao",
"Code": "+244"
},
{
"Name": "Anguilla",
"ISO": "ai",
"Code": "+1264"
},
{
"Name": "Antigua and Barbuda",
"ISO": "ag",
"Code": "+1268"
},
{
"Name": "Argentina",
"ISO": "ar",
"Code": "+54"
},
{
"Name": "Armenia",
"ISO": "am",
"Code": "+374"
},
{
"Name": "Aruba",
"ISO": "aw",
"Code": "+297"
},
{
"Name": "Australia",
"ISO": "au",
"Code": "+61"
},
{
"Name": "Austria",
"ISO": "at",
"Code": "+43"
},
{
"Name": "Azerbaijan",
"ISO": "az",
"Code": "+994"
},
{
"Name": "Bahamas",
"ISO": "bs",
"Code": "+1242"
},
{
"Name": "Bahrain",
"ISO": "bh",
"Code": "+973"
},
{
"Name": "Bangladesh",
"ISO": "bd",
"Code": "+880"
},
{
"Name": "Barbados",
"ISO": "bb",
"Code": "+1246"
},
{
"Name": "Belarus",
"ISO": "by",
"Code": "+375"
},
{
"Name": "Belgium",
"ISO": "be",
"Code": "+32"
},
{
"Name": "Belize",
"ISO": "bz",
"Code": "+501"
},
{
"Name": "Benin",
"ISO": "bj",
"Code": "+229"
},
{
"Name": "Bermuda",
"ISO": "bm",
"Code": "+1441"
},
{
"Name": "Bhutan",
"ISO": "bt",
"Code": "+975"
},
{
"Name": "Bolivia",
"ISO": "bo",
"Code": "+591"
},
{
"Name": "Bosnia and Herzegovina",
"ISO": "ba",
"Code": "+387"
},
{
"Name": "Botswana",
"ISO": "bw",
"Code": "+267"
},
{
"Name": "Brazil",
"ISO": "br",
"Code": "+55"
},
{
"Name": "British Indian Ocean Territory",
"ISO": "io",
"Code": "+246"
},
{
"Name": "British Virgin Islands",
"ISO": "vg",
"Code": "+1284"
},
{
"Name": "Brunei",
"ISO": "bn",
"Code": "+673"
},
{
"Name": "Bulgaria",
"ISO": "bg",
"Code": "+359"
},
{
"Name": "Burkina Faso",
"ISO": "bf",
"Code": "+226"
},
{
"Name": "Burundi",
"ISO": "bi",
"Code": "+257"
},
{
"Name": "Cambodia",
"ISO": "kh",
"Code": "+855"
},
{
"Name": "Cameroon",
"ISO": "cm",
"Code": "+237"
},
{
"Name": "Canada",
"ISO": "ca",
"Code": "+1"
},
{
"Name": "Cape Verde",
"ISO": "cv",
"Code": "+238"
},
{
"Name": "Caribbean Netherlands",
"ISO": "bq",
"Code": "+599"
},
{
"Name": "Cayman Islands",
"ISO": "ky",
"Code": "+1345"
},
{
"Name": "Central African Republic",
"ISO": "cf",
"Code": "+236"
},
{
"Name": "Chad",
"ISO": "td",
"Code": "+235"
},
{
"Name": "Chile",
"ISO": "cl",
"Code": "+56"
},
{
"Name": "China",
"ISO": "cn",
"Code": "+86"
},
{
"Name": "Colombia",
"ISO": "co",
"Code": "+57"
},
{
"Name": "Comoros",
"ISO": "km",
"Code": "+269"
},
{
  "Name": "Congo (DRC)",
  "ISO": "cd",
  "Code": "+243"
},
{
  "Name": "Congo (Republic)",
  "ISO": "cg",
  "Code": "+242"
},
{
  "Name": "Cook Islands",
  "ISO": "ck",
  "Code": "+682"
},
{
  "Name": "Costa Rica",
  "ISO": "cr",
  "Code": "+506"
},
{
  "Name": "CÃ´te dâ€™Ivoire",
  "ISO": "ci",
  "Code": "+225"
},
{
  "Name": "Croatia",
  "ISO": "hr",
  "Code": "+385"
},
{
  "Name": "Cuba",
  "ISO": "cu",
  "Code": "+53"
},
{
  "Name": "CuraÃ§ao",
  "ISO": "cw",
  "Code": "+599"
},
{
  "Name": "Cyprus",
  "ISO": "cy",
  "Code": "+357"
},
{
  "Name": "Czech Republic",
  "ISO": "cz",
  "Code": "+420"
},
{
  "Name": "Denmark",
  "ISO": "dk",
  "Code": "+45"
},
{
  "Name": "Djibouti",
  "ISO": "dj",
  "Code": "+253"
},
{
  "Name": "Dominica",
  "ISO": "dm",
  "Code": "+1767"
},
{
  "Name": "Dominican Republic",
  "ISO": "do",
  "Code": "+1"
},
{
  "Name": "Ecuador",
  "ISO": "ec",
  "Code": "+593"
},
{
  "Name": "Egypt",
  "ISO": "eg",
  "Code": "+20"
},
{
  "Name": "El Salvador",
  "ISO": "sv",
  "Code": "+503"
},
{
  "Name": "Equatorial Guinea",
  "ISO": "gq",
  "Code": "+240"
},
{
  "Name": "Eritrea",
  "ISO": "er",
  "Code": "+291"
},
{
  "Name": "Estonia",
  "ISO": "ee",
  "Code": "+372"
},
{
  "Name": "Ethiopia",
  "ISO": "et",
  "Code": "+251"
},
{
  "Name": "Falkland Islands",
  "ISO": "fk",
  "Code": "+500"
},
{
  "Name": "Faroe Islands",
  "ISO": "fo",
  "Code": "+298"
},
{
  "Name": "Fiji",
  "ISO": "fj",
  "Code": "+679"
},
{
  "Name": "Finland",
  "ISO": "fi",
  "Code": "+358"
},
{
  "Name": "France",
  "ISO": "fr",
  "Code": "+33"
},
{
  "Name": "French Guiana",
  "ISO": "gf",
  "Code": "+594"
},
{
  "Name": "French Polynesia",
  "ISO": "pf",
  "Code": "+689"
},
{
  "Name": "Gabon",
  "ISO": "ga",
  "Code": "+241"
},
{
  "Name": "Gambia",
  "ISO": "gm",
  "Code": "+220"
},
{
  "Name": "Georgia",
  "ISO": "ge",
  "Code": "+995"
},
{
  "Name": "Germany",
  "ISO": "de",
  "Code": "+49"
},
{
  "Name": "Ghana",
  "ISO": "gh",
  "Code": "+233"
},
{
  "Name": "Gibraltar",
  "ISO": "gi",
  "Code": "+350"
},
{
  "Name": "Greece",
  "ISO": "gr",
  "Code": "+30"
},
{
  "Name": "Greenland",
  "ISO": "gl",
  "Code": "+299"
},
{
  "Name": "Grenada",
  "ISO": "gd",
  "Code": "+1473"
},
{
  "Name": "Guadeloupe",
  "ISO": "gp",
  "Code": "+590"
},
{
  "Name": "Guam",
  "ISO": "gu",
  "Code": "+1671"
},
{
  "Name": "Guatemala",
  "ISO": "gt",
  "Code": "+502"
},
{
  "Name": "Guinea",
  "ISO": "gn",
  "Code": "+224"
},
{
  "Name": "Guinea-Bissau",
  "ISO": "gw",
  "Code": "+245"
},
{
  "Name": "Guyana",
  "ISO": "gy",
  "Code": "+592"
},
{
  "Name": "Haiti",
  "ISO": "ht",
  "Code": "+509"
},
{
  "Name": "Honduras",
  "ISO": "hn",
  "Code": "+504"
},
{
  "Name": "Hong Kong",
  "ISO": "hk",
  "Code": "+852"
},
{
  "Name": "Hungary",
  "ISO": "hu",
  "Code": "+36"
},
{
  "Name": "Iceland",
  "ISO": "is",
  "Code": "+354"
},
{
  "Name": "India",
  "ISO": "in",
  "Code": "+91"
},
{
  "Name": "Indonesia",
  "ISO": "id",
  "Code": "+62"
},
{
  "Name": "Iran",
  "ISO": "ir",
  "Code": "+98"
},
{
  "Name": "Iraq",
  "ISO": "iq",
  "Code": "+964"
},
{
  "Name": "Ireland",
  "ISO": "ie",
  "Code": "+353"
},
{
  "Name": "Israel",
  "ISO": "il",
  "Code": "+972"
},
{
  "Name": "Italy",
  "ISO": "it",
  "Code": "+39"
},
{
  "Name": "Jamaica",
  "ISO": "jm",
  "Code": "+1876"
},
{
  "Name": "Japan",
  "ISO": "jp",
  "Code": "+81"
},
{
  "Name": "Jordan",
  "ISO": "jo",
  "Code": "+962"
},
{
  "Name": "Kazakhstan",
  "ISO": "kz",
  "Code": "+7"
},
{
  "Name": "Kenya",
  "ISO": "ke",
  "Code": "+254"
},
{
  "Name": "Kiribati",
  "ISO": "ki",
  "Code": "+686"
},
{
  "Name": "Kuwait",
  "ISO": "kw",
  "Code": "+965"
},
{
  "Name": "Kyrgyzstan",
  "ISO": "kg",
  "Code": "+996"
},
{
  "Name": "Laos",
  "ISO": "la",
  "Code": "+856"
},
{
  "Name": "Latvia",
  "ISO": "lv",
  "Code": "+371"
},
{
  "Name": "Lebanon",
  "ISO": "lb",
  "Code": "+961"
},
{
  "Name": "Lesotho",
  "ISO": "ls",
  "Code": "+266"
},
{
  "Name": "Liberia",
  "ISO": "lr",
  "Code": "+231"
},
{
  "Name": "Libya",
  "ISO": "ly",
  "Code": "+218"
},
{
  "Name": "Liechtenstein",
  "ISO": "li",
  "Code": "+423"
},
{
  "Name": "Lithuania",
  "ISO": "lt",
  "Code": "+370"
},
{
  "Name": "Luxembourg",
  "ISO": "lu",
  "Code": "+352"
},
{
  "Name": "Macau",
  "ISO": "mo",
  "Code": "+853"
},
{
  "Name": "Macedonia",
  "ISO": "mk",
  "Code": "+389"
},
{
  "Name": "Madagascar",
  "ISO": "mg",
  "Code": "+261"
},
{
  "Name": "Malawi",
  "ISO": "mw",
  "Code": "+265"
},
{
  "Name": "Malaysia",
  "ISO": "my",
  "Code": "+60"
},
{
  "Name": "Maldives",
  "ISO": "mv",
  "Code": "+960"
},
{
  "Name": "Mali",
  "ISO": "ml",
  "Code": "+223"
},
{
  "Name": "Malta",
  "ISO": "mt",
  "Code": "+356"
},
{
  "Name": "Marshall Islands",
  "ISO": "mh",
  "Code": "+692"
},
{
  "Name": "Martinique",
  "ISO": "mq",
  "Code": "+596"
},
{
  "Name": "Mauritania",
  "ISO": "mr",
  "Code": "+222"
},
{
  "Name": "Mauritius",
  "ISO": "mu",
  "Code": "+230"
},
{
  "Name": "Mexico",
  "ISO": "mx",
  "Code": "+52"
},
{
  "Name": "Micronesia",
  "ISO": "fm",
  "Code": "+691"
},
{
  "Name": "Moldova",
  "ISO": "md",
  "Code": "+373"
},
{
  "Name": "Monaco",
  "ISO": "mc",
  "Code": "+377"
},
{
  "Name": "Mongolia",
  "ISO": "mn",
  "Code": "+976"
},
{
  "Name": "Montenegro",
  "ISO": "me",
  "Code": "+382"
},
{
  "Name": "Montserrat",
  "ISO": "ms",
  "Code": "+1664"
},
{
  "Name": "Morocco",
  "ISO": "ma",
  "Code": "+212"
},
{
  "Name": "Mozambique",
  "ISO": "mz",
  "Code": "+258"
},
{
  "Name": "Myanmar",
  "ISO": "mm",
  "Code": "+95"
},
{
  "Name": "Namibia",
  "ISO": "na",
  "Code": "+264"
},
{
  "Name": "Nauru",
  "ISO": "nr",
  "Code": "+674"
},
{
  "Name": "Nepal",
  "ISO": "np",
  "Code": "+977"
},
{
  "Name": "Netherlands",
  "ISO": "nl",
  "Code": "+31"
},
{
  "Name": "New Caledonia",
  "ISO": "nc",
  "Code": "+687"
},
{
  "Name": "New Zealand",
  "ISO": "nz",
  "Code": "+64"
},
{
  "Name": "Nicaragua",
  "ISO": "ni",
  "Code": "+505"
},
{
  "Name": "Niger",
  "ISO": "ne",
  "Code": "+227"
},
{
  "Name": "Nigeria",
  "ISO": "ng",
  "Code": "+234"
},
{
  "Name": "Niue",
  "ISO": "nu",
  "Code": "+683"
},
{
  "Name": "Norfolk Island",
  "ISO": "nf",
  "Code": "+672"
},
{
  "Name": "North Korea",
  "ISO": "kp",
  "Code": "+850"
},
{
  "Name": "Northern Mariana Islands",
  "ISO": "mp",
  "Code": "+1670"
},
{
  "Name": "Norway",
  "ISO": "no",
  "Code": "+47"
},
{
  "Name": "Oman",
  "ISO": "om",
  "Code": "+968"
},
{
  "Name": "Pakistan",
  "ISO": "pk",
  "Code": "+92"
},
{
  "Name": "Palau",
  "ISO": "pw",
  "Code": "+680"
},
{
  "Name": "Palestine",
  "ISO": "ps",
  "Code": "+970"
},
{
  "Name": "Panama",
  "ISO": "pa",
  "Code": "+507"
},
{
  "Name": "Papua New Guinea",
  "ISO": "pg",
  "Code": "+675"
},
{
  "Name": "Paraguay",
  "ISO": "py",
  "Code": "+595"
},
{
  "Name": "Peru",
  "ISO": "pe",
  "Code": "+51"
},
{
  "Name": "Philippines",
  "ISO": "ph",
  "Code": "+63"
},
{
  "Name": "Poland",
  "ISO": "pl",
  "Code": "+48"
},
{
  "Name": "Portugal",
  "ISO": "pt",
  "Code": "+351"
},
{
  "Name": "Puerto Rico",
  "ISO": "pr",
  "Code": "+1"
},
{
  "Name": "Qatar",
  "ISO": "qa",
  "Code": "+974"
},
{
  "Name": "RÃ©union",
  "ISO": "re",
  "Code": "+262"
},
{
  "Name": "Romania",
  "ISO": "ro",
  "Code": "+40"
},
{
  "Name": "Russia",
  "ISO": "ru",
  "Code": "+7"
},
{
  "Name": "Rwanda",
  "ISO": "rw",
  "Code": "+250"
},
{
  "Name": "Saint BarthÃ©lemy",
  "ISO": "bl",
  "Code": "+590"
},
{
  "Name": "Saint Helena",
  "ISO": "sh",
  "Code": "+290"
},
{
  "Name": "Saint Kitts and Nevis",
  "ISO": "kn",
  "Code": "+1869"
},
{
  "Name": "Saint Lucia",
  "ISO": "lc",
  "Code": "+1758"
},
{
  "Name": "Saint Martin",
  "ISO": "mf",
  "Code": "+590"
},
{
  "Name": "Saint Pierre and Miquelon",
  "ISO": "pm",
  "Code": "+508"
},
{
  "Name": "Saint Vincent and the Grenadines",
  "ISO": "vc",
  "Code": "+1784"
},
{
  "Name": "Samoa",
  "ISO": "ws",
  "Code": "+685"
},
{
  "Name": "San Marino",
  "ISO": "sm",
  "Code": "+378"
},
{
  "Name": "SÃ£o TomÃ© and PrÃ­ncipe",
  "ISO": "st",
  "Code": "+239"
},
{
  "Name": "Saudi Arabia",
  "ISO": "sa",
  "Code": "+966"
},
{
  "Name": "Senegal",
  "ISO": "sn",
  "Code": "+221"
},
{
  "Name": "Serbia",
  "ISO": "rs",
  "Code": "+381"
},
{
  "Name": "Seychelles",
  "ISO": "sc",
  "Code": "+248"
},
{
  "Name": "Sierra Leone",
  "ISO": "sl",
  "Code": "+232"
},
{
  "Name": "Singapore",
  "ISO": "sg",
  "Code": "+65"
},
{
  "Name": "Sint Maarten",
  "ISO": "sx",
  "Code": "+1721"
},
{
  "Name": "Slovakia",
  "ISO": "sk",
  "Code": "+421"
},
{
  "Name": "Slovenia",
  "ISO": "si",
  "Code": "+386"
},
{
  "Name": "Solomon Islands",
  "ISO": "sb",
  "Code": "+677"
},
{
  "Name": "Somalia",
  "ISO": "so",
  "Code": "+252"
},
{
  "Name": "South Africa",
  "ISO": "za",
  "Code": "+27"
},
{
  "Name": "South Korea",
  "ISO": "kr",
  "Code": "+82"
},
{
  "Name": "South Sudan",
  "ISO": "ss",
  "Code": "+211"
},
{
  "Name": "Spain",
  "ISO": "es",
  "Code": "+34"
},
{
  "Name": "Sri Lanka",
  "ISO": "lk",
  "Code": "+94"
},
{
  "Name": "Sudan",
  "ISO": "sd",
  "Code": "+249"
},
{
  "Name": "Suriname",
  "ISO": "sr",
  "Code": "+597"
},
{
  "Name": "Swaziland",
  "ISO": "sz",
  "Code": "+268"
},
{
  "Name": "Sweden",
  "ISO": "se",
  "Code": "+46"
},
{
  "Name": "Switzerland",
  "ISO": "ch",
  "Code": "+41"
},
{
  "Name": "Syria",
  "ISO": "sy",
  "Code": "+963"
},
{
  "Name": "Taiwan",
  "ISO": "tw",
  "Code": "+886"
},
{
  "Name": "Tajikistan",
  "ISO": "tj",
  "Code": "+992"
},
{
  "Name": "Tanzania",
  "ISO": "tz",
  "Code": "+255"
},
{
  "Name": "Thailand",
  "ISO": "th",
  "Code": "+66"
},
{
  "Name": "Timor-Leste",
  "ISO": "tl",
  "Code": "+670"
},
{
  "Name": "Togo",
  "ISO": "tg",
  "Code": "+228"
},
{
  "Name": "Tokelau",
  "ISO": "tk",
  "Code": "+690"
},
{
  "Name": "Tonga",
  "ISO": "to",
  "Code": "+676"
},
{
  "Name": "Trinidad and Tobago",
  "ISO": "tt",
  "Code": "+1868"
},
{
  "Name": "Tunisia",
  "ISO": "tn",
  "Code": "+216"
},
{
  "Name": "Turkey",
  "ISO": "tr",
  "Code": "+90"
},
{
  "Name": "Turkmenistan",
  "ISO": "tm",
  "Code": "+993"
},
{
  "Name": "Turks and Caicos Islands",
  "ISO": "tc",
  "Code": "+1649"
},
{
  "Name": "Tuvalu",
  "ISO": "tv",
  "Code": "+688"
},
{
  "Name": "U.S. Virgin Islands",
  "ISO": "vi",
  "Code": "+1340"
},
{
  "Name": "Uganda",
  "ISO": "ug",
  "Code": "+256"
},
{
  "Name": "Ukraine",
  "ISO": "ua",
  "Code": "+380"
},
{
  "Name": "United Arab Emirates",
  "ISO": "ae",
  "Code": "+971"
},
{
  "Name": "United Kingdom",
  "ISO": "gb",
  "Code": "+44"
},
{
  "Name": "United States",
  "ISO": "us",
  "Code": "+1"
},
{
  "Name": "Uruguay",
  "ISO": "uy",
  "Code": "+598"
},
{
  "Name": "Uzbekistan",
  "ISO": "uz",
  "Code": "+998"
},
{
  "Name": "Vanuatu",
  "ISO": "vu",
  "Code": "+678"
},
{
  "Name": "Vatican City",
  "ISO": "va",
  "Code": "+39"
},
{
  "Name": "Venezuela",
  "ISO": "ve",
  "Code": "+58"
},
{
  "Name": "Vietnam",
  "ISO": "vn",
  "Code": "+84"
},
{
  "Name": "Wallis and Futuna",
  "ISO": "wf",
  "Code": "+681"
},
{
  "Name": "Yemen",
  "ISO": "ye",
  "Code": "+967"
},
{
  "Name": "Zambia",
  "ISO": "zm",
  "Code": "+260"
},
{
  "Name": "Zimbabwe",
  "ISO": "zw",
  "Code": "+263"
}
])
