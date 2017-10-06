const electron=require('electron');
const ipcRenderer=electron.ipcRenderer;

const $=require('jquery');

$(function(){
  let $url=$('input[name=url]');
  let $download=$('button[name=download]');
  let $downloading=$('.downloading');
  function setDisabled(value){
    $url.prop('disabled',value);
    $download.prop('disabled',value);
    if(value){
      $downloading.fadeIn();
    }else{
      $downloading.fadeOut();
    }
  }
  $download.on('click',(e)=>{
    let url=$url.val();
    setDisabled(true);
    ipcRenderer.send('download',url);
    e.preventDefault();
  });
  ipcRenderer.on('complete',(e)=>{
    setDisabled(false);
    $url.val('');
  });
  ipcRenderer.on('error',(e,message)=>{
    setDisabled(false);
    alert(message);
  });
});
