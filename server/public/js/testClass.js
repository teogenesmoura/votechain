class testClass {
	constructor(name) {
	 this.name = name;
	}
	set setName(newName) {
	 this.name = newName;
	}
	get getName(){
	 return this.name;
	}
}
function newInstanceOfTestClass(name) {
	return new testClass(name);
}
function getNameTestClass(InstanceOfTestClass) {
	return InstanceOfTestClass.getName;
}