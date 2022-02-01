function init() {
	document.getElementById('addvalue').value=''
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementsByClassName("windowDragHeader")[0]) {
    document.getElementsByClassName("windowDragHeader")[0].onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

dragElement(document.getElementsByClassName("windowDrag")[0]);

let SettingWindowStatus = false
function ToggleSetting(ele=document.getElementsByClassName('windowDrag')[0]) {
	if (SettingWindowStatus) {
		ele.style = "display: none;"
		SettingWindowStatus = false
	}
	else {
		ele.style = "display: block;"
		SettingWindowStatus = true
	}
}


function UpdateInStorage(){
	localStorage.setItem("List_", JSON.stringify(List_));
}

function ReadFromStorage(){
	try {
		if (localStorage.getItem("List_") == null || localStorage.getItem("List_") == "" || JSON.parse(localStorage.getItem("List_")) == ""){
      	return [];
    }
    else {
		return JSON.parse(localStorage.getItem("List_"))
    }
  	} catch {
    	localStorage.setItem("List_", JSON.stringify([]));
    	return [];
  	}
}

let List_ = ReadFromStorage()

function AddInHtml(value)
{
  	let tempNode = document.createElement("div")
  	tempNode.id = value
	tempNode.className = "ele"
	tempNode.innerHTML = `<button class="btn del unselectable">X</button><label class="unselectable"> </label><label class="name">${tempNode.id}</label><p>`

	document.getElementById('list').appendChild(tempNode)

  	document.getElementById(value).getElementsByClassName('del')[0].addEventListener('click', function(ele) {
    	List_ = List_.filter(function(val, ind, arr){
			if (val==value){return false;}
			else {return true;}
		})
    	UpdateInStorage()

		ele.target.parentElement.classList += " removeds"
		setTimeout(() => {ele.target.parentElement.remove()}, 300);
  	})
}

if (List_.length != 0) {
  	for (let i = 0; i < List_.length; i++)
  	{
    	AddInHtml(List_[i])
  	}
}

function AddInList(value)
{
	if (List_.includes(value)) {
    	document.getElementById('addvalue').value = ''
    	document.getElementById('addvalue').placeholder = `Already exists: ${value}`
    	return 0;
  	}

  	else if (value == "") {
  		document.getElementById('addvalue').value = ''
    	document.getElementById('addvalue').placeholder = `None`
    	return 0;
  	}

  	document.getElementById('addvalue').value = ''

  	document.getElementById('addvalue').placeholder = value

  	console.log(value);

  	List_.push(value);

  	UpdateInStorage()

  	AddInHtml(value)
}

document.getElementById('fileUploadImport').addEventListener('change', FileReading, false);

function FileReading(event) {
  const reader = new FileReader()
  reader.onload = Import;
  reader.readAsText(event.target.files[0])
}

function Import(event)  {

	let TempList_ = JSON.parse(event.target.result)

	for (let i = 0; i < TempList_.length; i++)
  		{
  			if (List_.includes(TempList_[i])) {}
  			else {
  				List_.push(TempList_[i])
  				AddInHtml(TempList_[i])
  			}
  		}

  	UpdateInStorage()
}

function Export() {
    let EleDownload = document.createElement('a');
    EleDownload.setAttribute('href', 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(List_, 0, 4)));
    EleDownload.setAttribute('download', 'data.json');
    EleDownload.click();
}

document.addEventListener('keydown', function(event) {
  	if(event.keyCode == "13" && event.target.id == "addvalue"){
    	AddInList(document.getElementById('addvalue').value);
  	}
})

document.getElementById('addvalidebtn').addEventListener('click', function() {
  	AddInList(document.getElementById('addvalue').value);
})

document.getElementById('settingbtn').addEventListener('click', function() {
  	ToggleSetting();
})