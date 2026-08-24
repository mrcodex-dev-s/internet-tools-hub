const input=document.getElementById("input-text");
const generate=document.getElementById("generate-btn");
const clear=document.getElementById("clear-btn");
const download=document.getElementById("download-btn");
const placeholder=document.getElementById("qr-placeholder");
const container=document.getElementById("qr-container");
const error=document.getElementById("error-msg");

let qr=null;

function resetError(){error.textContent="";error.classList.remove("visible");}

generate.addEventListener("click",()=>{
  resetError();
  const value=input.value.trim();

  if(!value){
    error.textContent="Please enter some text or a URL.";
    error.classList.add("visible");
    return;
  }

  container.innerHTML="";
  placeholder.style.display="none";
  container.classList.add("has-qr");

  qr=new QRCode(container,{
    text:value,
    width:240,
    height:240,
    colorDark:"#1A1D21",
    colorLight:"#FFFFFF",
    correctLevel:QRCode.CorrectLevel.H
  });

  download.disabled=false;
});

clear.addEventListener("click",()=>{
  input.value="";
  resetError();
  container.innerHTML="";
  container.classList.remove("has-qr");
  placeholder.style.display="flex";
  download.disabled=true;
  qr=null;
  input.focus();
});

download.addEventListener("click",()=>{
  if(!qr)return;

  const canvas=container.querySelector("canvas");
  const img=container.querySelector("img");
  let url="";

  if(canvas) url=canvas.toDataURL("image/png");
  else if(img) url=img.src;
  else return;

  const link=document.createElement("a");
  link.href=url;
  link.download="internet-tools-hub-qr-code.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
});

input.addEventListener("keydown",(e)=>{
  if((e.ctrlKey||e.metaKey)&&e.key==="Enter") generate.click();
});
