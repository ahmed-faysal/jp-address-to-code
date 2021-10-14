export const jpNumberToNumerics: {[key: string]: number} = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10
}

export const conversionStr: string[] = [
  '丁目',
  '丁',
  '番地',
  '番',
  '号',
  '地割',
  '地',
  '線',
  'の',
  'ノ'
]

export const charToCodeValues: {[key: string]: string} = {
  A: 'a0',
  B: 'a1',
  C: 'a2',
  D: 'a3',
  E: 'a4',
  F: 'a5',
  G: 'a6',
  H: 'a7',
  I: 'a8',
  J: 'a9',
  K: 'b0',
  L: 'b1',
  M: 'b2',
  N: 'b3',
  O: 'b4',
  P: 'b5',
  Q: 'b6',
  R: 'b7',
  S: 'b8',
  T: 'b9',
  U: 'c0',
  V: 'c1',
  W: 'c2',
  X: 'c3',
  Y: 'c4',
  Z: 'c5'
}

export const codeToCharValues: {[key: string]: string} = {
  a: 'CC1',
  b: 'CC2',
  c: 'CC3',
  d: 'CC4',
  e: 'CC5',
  f: 'CC6',
  g: 'CC7',
  h: 'CC8'
}

export const checkDigitValues: {[key: string]: number} = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '-': 10,
  a: 11,
  b: 12,
  c: 13,
  d: 14,
  e: 15,
  f: 16,
  g: 17,
  h: 18
}

// convert character into code values  ex.A → a0 , L → b1
const convertAlphabet = (addressCode: string) => {
  let newAddressCode = ''

  for (let i = 0; i < addressCode.length; i++) {
    if (addressCode.charAt(i).match(/[A-Z]/i)) {
      newAddressCode += charToCodeValues[addressCode.charAt(i)]
    } else {
      newAddressCode += addressCode.charAt(i)
    }
  }

  return newAddressCode
}

const generateAddressCodeB = (address: string) => {

  const addressCode = address
    .trim()
    .toUpperCase()
    .replace(/[&/.・]/g, '')

  let tempCode = ''
  const jpNumKeys = Object.keys(jpNumberToNumerics)

  // 文字列の各文字に対して、抜き出し対象とするか、抜き出し対象から取り除くか、ハイフンに変換のどれに当てはまるか判断
  for (let i = 0; i < addressCode.length; i++) {
    // 数字以外のいずれかの文字　（アルファベット、ひらがな、カタカナ、漢字、ハイフンなどの記号）であるか
    if (addressCode.charAt(i).match(/[^0-9]/)) {
      // アルファベットかつ、前後にアルファベットが連続していないか　（抜き出し対象）   ex. 1B2
      if (
        addressCode.charAt(i).match(/[A-Z]/i) &&
        addressCode.charAt(i - 1).match(/[^A-Z]/i) &&
        addressCode.charAt(i + 1).match(/[^A-Z]/)
      ) {
        // アルファベットが "F" であるか　（Fの直後が抜き出し対象の場合、Fはハイフン1文字に変換　）　　ex. 1F1　→ 1-1
        if (addressCode.charAt(i) === 'F') {
          tempCode += '-'
        } else {
          tempCode += addressCode.charAt(i)
        }

        // 数字の直後にくる "F" が1文字だけであるか　（例のような場合、抜き出し対象から取り除く）　　　ex. ~ビル2F →　 ~ビル2
      } else if (
        addressCode.charAt(i) === 'F' &&
        addressCode.charAt(i + 1) === '' &&
        addressCode.charAt(i - 1).match(/[0-9]/)
      ) {
        tempCode = tempCode + ''

        // アルファベットかつ、最後の文字であり、 "F"ではないか　　　　　　　　ex. ~~2B → ~~2B （抜き出し対象）
      } else if (
        addressCode.charAt(i).match(/[A-Z]/i) &&
        addressCode.charAt(i + 1) === '' &&
        addressCode.charAt(i) !== 'F'
      ) {
        tempCode += addressCode.charAt(i)

        // 漢字、ひらがな、ハイフン、空文字、連続したアルファベットであるか　  ex. 　ABCビル　　→ -----
      } else {
        // 漢数字が特定の文字列群（conversionStr)の前に存在するかどうか判断

        // 漢数字が1文字かつ十ではない場合　 　ex. 六番地　　→ 　6--
        if (
          jpNumKeys.find((element) => element === addressCode.charAt(i)) &&
          conversionStr.includes(addressCode.charAt(i + 1))
        ) {
          tempCode += jpNumberToNumerics[addressCode.charAt(i)]

          // 漢数字が2桁かつ1の位が0以外の場合　　　ex. 六十一番地　　→ 61--
        } else if (
          jpNumKeys.find((element) => element === addressCode.charAt(i)) &&
          addressCode.charAt(i + 1) === '十' &&
          jpNumKeys.find((element) => element === addressCode.charAt(i + 2))
        ) {
          tempCode +=
            jpNumberToNumerics[addressCode.charAt(i)].toString() +
            jpNumberToNumerics[addressCode.charAt(i + 2)].toString()
          i += 3

          // 漢数字が2桁かつ1の位が0の場合　　　　ex.　　三十丁目　　→ 30--
        } else if (
          jpNumKeys.find((element) => element === addressCode.charAt(i)) &&
          addressCode.charAt(i + 1) === '十' &&
          conversionStr.includes(addressCode.charAt(i + 2))
        ) {
          tempCode += jpNumberToNumerics[addressCode.charAt(i)].toString + '0'
          i += 2

          // 漢数字が2桁かつ10のくらいが1の場合  ex.  十五地割　　→ 　15--
        } else if (
          addressCode.charAt(i) === '十' &&
          jpNumKeys.find((element) => element === addressCode.charAt(i + 1))
        ) {
          tempCode += 1

          // 漢数字が十の場合　 　ex.  十番地　 → 　10
        } else if (
          addressCode.charAt(i) === '十' &&
          conversionStr.includes(addressCode.charAt(i + 1))
        ) {
          tempCode += 10

          // 漢数字以外の場合（ひらがな、ハイフン、空文字、連続したアルファベットなど)
        } else {
          tempCode += '-'
        }
      }

      // 数字(0~9)の場合、そのまま数字を格納　　ex.  480 → 480
    } else {
      tempCode += addressCode.charAt(i)
    }
  }

  tempCode = tempCode.replace(/\-+/g, '-')

  // remove first and final hyphen
  if (tempCode.charAt(0) === '-') {
    tempCode = tempCode.slice(1)
  }
  if (tempCode.charAt(tempCode.length - 1) === '-') {
    tempCode = tempCode.slice(0, tempCode.length - 1)
  }

  // remove hyphens before and after the alphabet
  let temp2 = ''
  for (let i = 0; i < tempCode.length; i++) {
    if (
      tempCode.charAt(i) === '-' &&
      (tempCode.charAt(i + 1).match(/[A-Z]/i) ||
        tempCode.charAt(i - 1).match(/[A-Z]/i))
    ) {
      temp2 = temp2 + ''
    } else {
      temp2 = temp2 + tempCode.charAt(i)
    }
  }
  
  tempCode = temp2

  // convert character into code values  ex.A → a0 , L → b1
  tempCode = convertAlphabet(tempCode)

  // add "d" ( d will be changed to "CC4") or remove extra characters in order to align to 13 digits
  if (tempCode.length < 13) {
    tempCode = tempCode + 'd'.repeat(13 - tempCode.length)
  } else {
    tempCode = tempCode.slice(0, 13)
  }

  return tempCode
}

const generateCheckDigit = (addressAB: string) => {
  let totalCount: number = 0

  for (let i = 0; i < addressAB.length; i++) {
    if (addressAB.charAt(i)) {
      totalCount = totalCount + Number(checkDigitValues[addressAB.charAt(i)])
    }
  }

  const result: number = Math.ceil(totalCount / 19) * 19 - totalCount

  return Math.abs(result)
}

const reConversionCharValue = (addressAB: string) => {
  let newCharValue = ''
  for (let i = 0; i < addressAB.length; i++) {
    if (addressAB.charAt(i).match(/[a-h]/i)) {
      newCharValue += codeToCharValues[addressAB.charAt(i)]
    } else {
      newCharValue += addressAB.charAt(i)
    }
  }

  return newCharValue
}

export const generateAddressCode = (address: string) => {
  const addressA = address.slice(0, 9).replace(/-/g, '').trim()
  const addressB = generateAddressCodeB(address.slice(8))

  const addressAB = addressA + addressB

  const checkDigit = generateCheckDigit(addressAB)
  
  let CDvalue = ''
  if (checkDigit > 10) {
    const CDkey = Object.keys(checkDigitValues).find(
      (res) => checkDigitValues[res] === checkDigit
    ) as string
    CDvalue = codeToCharValues[CDkey]
  } else if (checkDigit === 10) {
    CDvalue = '-'
  } else {
    CDvalue = checkDigit.toString()
  }

  const printableAddressCode = '<' + addressAB + CDvalue + '>'

  const fullAddressCode = 'STC' + reConversionCharValue(addressAB) + CDvalue + 'SPC'

  return { PrintableAddressCode: printableAddressCode, FullAddressCode: fullAddressCode }
}
