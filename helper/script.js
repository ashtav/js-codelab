const isFloat = function (n) {
    return Number(n) === n && n % 1 !== 0;
}

// get length of number after comma
const getDecimal = function (n, s = '.') {
    return n.toString().split(s)[1]?.length || 0;
}

// this function is to convert number to IDR currency format
// ex: 1500.numToIdr() => 1.500
String.prototype.numToIdr = function (params) {
    let number = Number(this.toString() || 0);
    return currency(number, { separator: '.', decimal: ',', precision: params?.precision ?? getDecimal(number), symbol: params?.symbol ?? '' }).format()
}

// this function is to convert IDR currency format to number
// ex: 'Rp55.000,83' => 55000.83
String.prototype.strToNum = function () {
    let number = this.toString();
    return currency(number, { separator: '.', decimal: ',', precision: getDecimal(number, ',') }).value
}

class Helper {
    constructor() {

        this.init = function () {

            $(document).ready(function () {
                const el = 'input[idr-format]'

                let keyCode = 0

                const formatting = (el, hasChanges = false) => {
                    let currentVal = $(el).val();
                    let _str = `${currentVal}`.strToNum()

                    if (keyCode != 44 || hasChanges) {
                        $(el).val(`${_str}`.numToIdr({}))
                    }

                    if (currentVal == 0) {
                        $(el).val('')
                    }
                }

                $(document).on('keypress', el, function (e) {
                    // accept only digits, dot, comma, backspace, space and minus sign
                    // backspace = 8, dot = 46, comma = 44, minus sign = 45, space = 32
                    if (e.which != 8 && e.which != 0 && e.which != 44 && (e.which < 48 || e.which > 57)) {
                        return false
                    }

                    if (e.which == 44 && $(this).val().indexOf(',') != -1) {
                        return false
                    }

                    keyCode = e.which

                }).on('input', el, function () {
                    formatting($(this))
                }).on('change', el, function () {
                    formatting($(this), true)
                })
            })
        }
    }
}

const helper = new Helper();
helper.init()