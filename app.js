let districtList = [];
let rewardList = ["Funcoins","card"];

// buttons
const showHideBtn = document.getElementById("show-hide");
const newDistrictBtn = document.getElementById("new-district");
const addRewardBtn = document.getElementById("add-reward");
const clearRewardsBtn = document.getElementById("clear-rewards");
const confirmChangesBtn = document.getElementById("confirm");
const userInputArea = document.getElementById("district-quantity");

const logCurrentBtn = document.getElementById("log-current-pool")
const logOverallBtn = document.getElementById("log-overall-pool")

const testBtn = document.getElementById("reload-chapter");
//

const tileArea = document.getElementById("tile-area");
const allOptions = document.getElementById("allOptions");
const finishedDistrictsDisplay = document.getElementById("finished-districts");
const rewardsGainedDisplay = document.getElementById("rewards-gained");

// options hidden by default
allOptions.style.display = "none"


const districtTable = document.getElementById("district-table");

////
////
////
////
////
////
//// USER INPUT: /////

addAllEventListeners()
function addAllEventListeners(){
  tileArea.addEventListener("click", tileSelected)
  testBtn.addEventListener("click", reloadChapter);
  userInputArea.addEventListener("click", alertAboutMakingChanges)

  logCurrentBtn.addEventListener("click", logCurrentPool)
  logOverallBtn.addEventListener("click", logOverallPool)

  showHideBtn.addEventListener("click", showHideOptions);
  newDistrictBtn.addEventListener("click", createDistrict);
  document.addEventListener("click", removeDistrict);
  allOptions.addEventListener("click", updateAllIndividualProps)
  addRewardBtn.addEventListener("click", addReward);
  clearRewardsBtn.addEventListener("click", clearRewards);
  confirmChangesBtn.addEventListener("click", confirmReload);
}

class District {
  constructor(name) {
    this.name = name;
    this.number = 0;
    this.rewards = [];

    // (this.difficulty) stupid workaround to stop values from resetting
    this.easy = ""
    this.medium = ""
    this.hard = ""

    this.difficulty = "easy"
    this.instances = 50;
    this.encounters = 2;
    this.maxCount = 999
  }

  populateTable(){
    let row = districtTable.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);


    cell1.innerHTML = this.name + `\n<button class="remove" id="${this.name + "**remove"}">remove</button>`;
    cell2.innerHTML = createCheckboxes(this.name, this.rewards);
    cell3.innerHTML = `<select class="difficulty" id="${"difficulty**" + this.name}">
                <option value="easy"${this.easy}>easy</option>
                <option value="medium"${this.medium}>medium</option>
                <option value="hard"${this.hard}>hard</option>
              </select>`;
    cell4.innerHTML = `<input class="instances" type="number" id="${this.name + "**instances"}" min="1" step="1" value="${this.instances}">`;
    cell5.innerHTML = `<input class="encounters" type="number" id="${this.name + "**encounters"}" min="0" step="1" value="${this.encounters}">`;
    cell6.innerHTML = `<input class="max-count" type="number" id="${this.name + "**max"}" min="0" step="1" value="${this.maxCount}">`;


    function createCheckboxes(name, indivRewards){
      let checkboxes = "";
      for (var i=0; i < rewardList.length; i++) {
        let current = rewardList[i]
        let checked = indivRewards.includes(current)
        if (checked) {
          let text = `<input checked type="checkbox" class="reward-checkbox" id="${rewardList[i] + "**" + name}">
                    <label for="${rewardList[i]}">${rewardList[i]}</label><br>
                    `;
          checkboxes += text;
        } else {
          let text = `<input type="checkbox" class="reward-checkbox" id="${rewardList[i] + "**" + name}">
                    <label for="${rewardList[i]}">${rewardList[i]}</label><br>
                    `;
          checkboxes += text;
        }
      }
      return checkboxes;
    }
  }
}


function showHideOptions(e) {
  
  if (allOptions.style.display === "none") {
    allOptions.style.display = "block";
    window.scroll({
      top: 800,
      behavior: 'smooth'
    });
  } else {
    allOptions.style.display = "none";
  }
}


function createDistrict(district){
  district = new District(district);
  newDistrict = prompt("New district:");
  if(newDistrict === ""){
    alert("You have to specify a name")
  } else if(newDistrict === null){
    return
  }
  else{
    district.name = newDistrict
    districtList.push(district);
    district.number = districtList.indexOf(district);
    resetTable();

  }
}

function removeDistrict(e){
  let distName = e.target.id.split("**")[0];
  if (e.target.classList.contains("remove")){
    if (confirm("Remove district permanently?")){
      for (var i =0; i<districtList.length; i++){
        if (districtList[i].name == distName){
          districtList.splice(i,1);
          resetTable();
        }
      }
    }
  }
}

function addReward(e){
  let newReward = prompt("enter a new reward:")
  if (rewardList.includes(newReward)) {
    alert("This reward already exists")
  } else if (newReward === null){
      return
  } else if (newReward === ""){
      alert("you need to specify a name")
  } else {
    rewardList.push(newReward)
    resetTable();
  }
}

function clearRewards(e){
    if (confirm("Remove all existing rewards?")){
      rewardList = [];
      resetTable();
    }  
}

function resetTable() {
  // delete all rows except the header
  for(var i = 1; i<districtTable.rows.length; ){
    districtTable.deleteRow(i);
  }

  // populate rows based on the district list
  for(var i = 0; i<districtList.length;i++){
    districtList[i].populateTable()
  }

}

function clearIndividualRewards(){
  for (let i=0; i<districtList.length; i++){
    districtList[i].rewards = []
  }
}

function findIndexByName(name){
  for (let i=0; i<districtList.length; i++){
    if (districtList[i].name == name){
      return i
    }
  }
}


function updateIndividualRewards(){
  let collection = document.getElementsByClassName("reward-checkbox");
  // clear individual rewards
  clearIndividualRewards()

  // now only append those checked.
  //for each district 
  for (let i=0; i<collection.length; i++){

    let reward = collection[i].id.split("**")[0];
    let distr = collection[i].id.split("**")[1];
    let index = findIndexByName(distr)

    //if checked
    if (collection[i].checked){
      //append to district.rewards
      districtList[index].rewards.push(reward)
    }
  }
}

function updateIndividualDifficulty(){
  let collection = document.getElementsByClassName("difficulty");
  for (let i=0; i<collection.length; i++){
    let diff = collection[i].value;
    let distr = collection[i].id.split("**")[1];
    let index = findIndexByName(distr);

    switch (diff) {
      case "easy":
        districtList[index].easy = " selected";
        districtList[index].medium = "";
        districtList[index].hard = "";
        districtList[index].difficulty = "easy";
        break;
      case "medium":
        districtList[index].easy = "";
        districtList[index].medium = " selected";
        districtList[index].hard = "";
        districtList[index].difficulty = "medium";
        break;
      case "hard":
        districtList[index].easy = "";  
        districtList[index].medium = "";
        districtList[index].hard = " selected";
        districtList[index].difficulty = "hard";
        break
    }
  }
}

function updateIndividualInstances(){
  let collection = document.getElementsByClassName("instances");
  for (let i=0; i<collection.length; i++){
    let insta = collection[i].value;
    let distr = collection[i].id.split("**")[0];
    let index = findIndexByName(distr);

    districtList[index].instances = insta
  }
}

function updateIndividualEncounters(){
  let collection = document.getElementsByClassName("encounters");
  for (let i=0; i<collection.length; i++){
    let encount = collection[i].value;
    let distr = collection[i].id.split("**")[0];
    let index = findIndexByName(distr);

    districtList[index].encounters = encount
  }
}

function updateIndividualMaxCount(){
  let collection = document.getElementsByClassName("max-count");
  for (let i=0; i<collection.length; i++){
    let mCount = collection[i].value;
    let distr = collection[i].id.split("**")[0];
    let index = findIndexByName(distr);

    districtList[index].maxCount = mCount;
  }
}

function encounterSmallerThanMax(){
  for (let i=0; i < districtList.length; i++){
    let dist = districtList[i];
    let min = parseInt(dist.encounters, 10)
    let max = parseInt(dist.maxCount, 10)
    if (max >= min){
      continue
    } else{
      return false
    }
  }
  return true
}

// check if the caclulated chapter span is smaller than teh collective maxCount. If it is, return true.
function chapterSmallerThanMax(calculatedChapterSpan){
  let collectiveMax = 0
  for (let i = 0; i < districtList.length; i++){
    let dist = districtList[i];
    collectiveMax += parseInt(dist.maxCount, 10)
  }
  if (calculatedChapterSpan <= collectiveMax){
    return true;
  }else{
    return false;
  }
}


////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
//// GAMEPLAY ////

let districtOverallPool = [];
let districtMustHavePool = [];
let districtActualPool = [];

let currentlyDisplayedDistricts = [];
let finishedDistricts = [];
let rewardsGained = [];
let currentChapter = 1;

function updateAllIndividualProps(e){
  // this is a workaround for vanishing rewards checkboxes....

  updateIndividualEncounters()
  updateIndividualMaxCount()
  updateIndividualInstances()
  updateIndividualDifficulty()
  updateIndividualRewards()
}



let userNotAlerted = true
function alertAboutMakingChanges(e) {
  //// and this is to avoid changes being made mid-run:
  if (currentChapter !== 1 && e.target.id !=="confirm" && userNotAlerted){
    userNotAlerted = false;
    alert(`User movement in options-area detected!
      You are currently in the middle of a run.
      If you make any changes to the options, please make sure to "confirm changes and reload"
      Strange things might happen otherwise ;)`);
  }
}

function clearEverything(){
  districtOverallPool = [];
  districtMustHavePool = [];
  districtActualPool = [];
  currentlyDisplayedDistricts = [];
  finishedDistricts = [];
  rewardsGained = [];
  currentChapter = 1;
  updateFinishedDistrictsDisplay();
  updateRewardsGainedDisplay();
  userNotAlerted = true;
}

function getChapterLength(){
  return document.getElementById("chapter-length").value
}

function getNumberOfTiles(){
  return document.getElementById("tile-number").value
}

function calculateChapterSpan(){
  return getChapterLength() * getNumberOfTiles()
} 


/// populating the Overall Pool
function addInstancesToPool(district){
  let times = district.instances
  // populate overalpool with as many instances as the district.instances suggests:
  for(let i = 0; i < times; i++){
    districtOverallPool.push(district)
  }
}
function populateOverallPool (){
  districtOverallPool = []
  for (let i = 0; i < districtList.length; i++){
    addInstancesToPool(districtList[i]);
  }
}



function populateMustHaves(){
  districtMustHavePool = []
  //for each district:
  for (let i=0; i<districtList.length; i++){
    let dist = districtList[i];
    // do the loop as many times as maxCount specifies:
    for(let i=0; i<dist.encounters; i++){
      districtMustHavePool.push(dist)
      //push it to the must have pool as many times as it says.
    }
  }
}

// check how many of the same district are in the array
function checkCount(district, array){
  let count = array.reduce(function(n, val){
    return n + (val === district);
  }, 0);
  return count;
}


function getRandomFromArray(array){
  let randItem = array[Math.floor(Math.random()*array.length)];
  return randItem
}


function populateActualPool(calculatedChapterSpan){
  districtActualPool = [];
  populateMustHaves();
  populateOverallPool();
  // first add all the must haves to actual pool:
  for (let i=0; i < districtMustHavePool.length; i++){
    // declare current district
    let district = districtMustHavePool[i];
    districtActualPool.push(district);
  }
  // populate with the rest, as long as the chapter length is not met:
  while (districtActualPool.length < calculatedChapterSpan) {
    // take a random district from the overall pool:
    let district = getRandomFromArray(districtOverallPool);
    // count how many of the current district are there already:
    let distCount = checkCount(district, districtActualPool)
    // check if current district didn't reach it's max count in actual pool:
    if (distCount < district.maxCount){
      // add district to actual pool:
      districtActualPool.push(district)
    }else{
      continue
    }
  }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function numberOfObjectsInArray(object, array){
  const a = array

  const aCount = new Map([...new Set(a)].map(
    x => [x, a.filter(y => y === x).length]
));
  if (aCount.get(object) == undefined){
    return 0
  }else{
    return aCount.get(object)
  }
}

function updateFinishedDistrictsDisplay(){
  finishedDistrictsDisplay.innerHTML = `\n<strong>Finished districts:</strong> <br>\n${finishedDistricts} `
}

function updateRewardsGainedDisplay(){
  let finalString = `<strong>Rewards gained:</strong> `
  for (i = 0; i < rewardList.length; i++){
    let tempNum = numberOfObjectsInArray(rewardList[i], rewardsGained);
    let tempString = rewardList[i] + ":  " + tempNum;
    finalString += ("<br>" + tempString);
  }
  rewardsGainedDisplay.innerHTML = finalString;
}

function logCurrentPool(){
  console.log(districtActualPool)
}

function logOverallPool(){
  console.log(districtOverallPool)
}


function createNewTile(district){
  let newTile = document.createElement("div");
  newTile.className = "card";
  // newTile.id = ""; // moze currentChapter+name+reward?
  newTile.innerHTML = `<h3>${district.name}</h3>
    <br>
    <p>Reward:</p>
    <p>${getRandomFromArray(district.rewards)}</p>
    <p class="show-diffic">${district.difficulty}</p>
    `

  tileArea.appendChild(newTile);
}

function spawnTiles(){
  // clear displayed districts list
  currentlyDisplayedDistricts = []
  // clear previous tiles from the screen
  removeAllChildNodes(tileArea)
  // get the first object from actual pool (the list is already randomized)
  let dist = districtActualPool[0];
  // loop for each tile for the play area:
  let tileNum = getNumberOfTiles()
  for(i=0; i<tileNum; i++){
    let dist = districtActualPool.pop();
    currentlyDisplayedDistricts.push(dist);
    createNewTile(dist);
  } 

}

function tileSelected(e){
  //check if card was clicked:
  if (e.target.className==="card"){

    let tileElements = e.target.children
    let name = tileElements.item(0).innerHTML;
    let reward = tileElements.item(3).innerHTML;
    // let difficulty = tileElements.item(4).innerHTML;
    finishedDistricts.push(name);
    rewardsGained.push(reward);
    currentChapter += 1
    if (currentChapter > getChapterLength()){
      updateFinishedDistrictsDisplay()
      updateRewardsGainedDisplay()
      alert("You've finished this chapter.")
      removeAllChildNodes(tileArea)
      currentChapter = 1
    }else{
      updateFinishedDistrictsDisplay()
      updateRewardsGainedDisplay()
      spawnTiles()
    }
  }
}


function reloadChapter(){
  confirmReload()
}


function confirmReload(){
  clearEverything();
  let chapLen = calculateChapterSpan()
  updateAllIndividualProps();
  if (!(encounterSmallerThanMax())){
    alert("Districts can't have the 'Must Encounter' value larger than the 'Max Count'.")
  }else if(!(chapterSmallerThanMax(chapLen))){
    alert(`With the current settings we need at least ${chapLen} districts in the pool to finish the chapter.
      Please do one of the following:
      - raise the "Max count" for some of the districts
      - lower the "Number of tiles in play area"
      - lower the "Chapter length"
      `)
  }else if(chapLen<2){
    alert("Is it just me, or is this chapter really really short? Please make it a little longer, it will be more fun!")
  }else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    populateActualPool(chapLen)
    shuffleArray(districtActualPool)
    spawnTiles()
  }
  
}
