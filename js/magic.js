//magic
//magicToggle
function magicToggle(){
	if(!magic){
		magicOn();
	}
	else{
		magicOff();
	}
};
function magicOn(){
	document.getElementById("magicToggle").className = 'buttonWait';
		magic=true;
}
function magicOff(){
	document.getElementById("magicToggle").className = 'button';
	magic=false;
}
