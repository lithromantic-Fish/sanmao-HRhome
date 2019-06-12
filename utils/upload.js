//上传文件 
const app =getApp()
function upload(file){
  const fdStart = file.indexOf("/Wechatfile");
  const promise = new Promise((resolve,rej)=>{
    if (file.indexOf(fdStart) < 0) {
      return wx.uploadFile({
        url: app.globalData.url + '/hr/hrhome/hractivity/ajax_upload_image?hrhome_token='+ app.globalData.hrhome_token,
        filePath: file,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function (res) {
          console.log(res)
          resolve(res)
          var data = res.data
          console.log(data)
        },
        fail: res => {
          rej(res)
        }
      })
    }else{
      let data1 = JSON.stringify({filename:file})
      console.log(data1)
      const obj = {
          data:data1,
      }
      resolve(obj)
    }
  })
  return promise   
}
module.exports = {
  upload,
}