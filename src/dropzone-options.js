import XLSX from 'xlsx'

export default function(instance, methodName) {
  return {
    accept(file, done) {
      var reader = new FileReader();

      reader.addEventListener("loadend", event => {
        file = event.target.result
        let workbook = XLSX.read(file, {type: "array", cellStyles: true});
        instance[methodName](workbook);
      });

      reader.readAsArrayBuffer(file);
    },

    autoQueue: false, // stop upload

    // stuff that's not used, because we're not uploading,
    // but dropzone complains if you don't include it
    url: 'https://httpbin.org/post',
    thumbnailWidth: 150,
    maxFilesize: 0.5,
    headers: { "My-Awesome-Header": "header value" },
  }
}
