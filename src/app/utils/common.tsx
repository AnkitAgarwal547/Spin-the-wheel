

export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let fileInfo
    let baseURL
    // Make new FileReader
    let reader = new FileReader()

    // Convert the file to base64 text
    reader.readAsDataURL(file)

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result
      resolve(baseURL)
    }
  })
}

export const crackers = [
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/rocket_blue.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker1.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker2.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker3.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/rocket_red.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker4.png',
]

