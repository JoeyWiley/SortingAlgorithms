//----------------- Global Variables -----------------//
const startingCont = document.getElementById("startingContainer");
const mainCont = document.getElementById("mainContainer");
var numBars = 50;
var prevNumBars = 50;
//--------------- Button Ripple Effect ---------------//
const buttons = document.getElementsByClassName("sortButton");
for (const button of buttons) {
  button.addEventListener("mousedown", createRipple);
}
//-------------- Main Utility Functions --------------//
document.getElementById("sizeSelectorIndicator").style.left = document.getElementById("barButton50").offsetLeft + "px";
async function barNumChange(newNumBars) {
	let subject = document.getElementById("sizeSelectorIndicator");
	let target = document.getElementById(newNumBars);
	subject.style.left = target.offsetLeft + "px";
	console.log(subject.style.left, target.getBoundingClientRect().left);
	
	if (newNumBars == "barButton50") {
		numBars = 50;
	} else if (newNumBars == "barButton250") {
		numBars = 250;
	} else if (newNumBars == "barButton100") {
		numBars = 100;
	} else if (newNumBars == "barButton500") {
		numBars = 500;
	}
}
function createRipple(event) {
  const button = event.currentTarget;

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}
function findBar(barId) {
  bar = document.getElementById("bar_" + (barId));
  return bar;
}
async function start(algorithm) {
  startingCont.style.pointerEvents = "none";
  await sleep(400);
  await makeBars();
	prevNumBars = numBars;
  if (algorithm == "bubble") {
    bubbleSort();
  }
  else if (algorithm == "selection") {
    selectionSort();
  }
  else if (algorithm == "shell") {
    shellSort();
  }
  else if (algorithm == "merge") {
    mergeSort();
  }
	else if (algorithm == "quick") {
		quickSort();
	}
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function makeBars() {
  startingCont.style.opacity = 0;
  let buttons = document.getElementsByClassName("sortButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.animation = "buttonSlideOut 1s ease-in";
  }
	
  var children = mainCont.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.opacity = 0;
    await sleep(1);
  }
  await sleep(400);
  while (mainCont.firstChild) {
    mainCont.removeChild(mainCont.firstChild);
  }
  numList = []

  var numList = [];
  for (let i = 1; i <= numBars; i++) {
    numList.push(i);
  }

  for (let i = 0; i < numBars; i++) {
    randNum = Math.floor(Math.random() * numList.length);
    num = numList[randNum];
    numList.splice(randNum, 1);
    var newBar = document.createElement("div");
    newBar.id = "bar_" + i;
    newBar.classList.add("bar");
		if (numBars == 50) {
			newBar.style.height = "calc((100% / " + numBars + ") * " + num + " - 1%)";
		} else {
			newBar.style.height = "calc((100% / " + numBars + ") * " + num + ")";
		}
		let widthSize = -0.002 * numBars + 0.3;
		if (widthSize < 0) {
			widthSize = 0;
		}
		newBar.style.margin = widthSize + "%";
		newBar.style.width = 2 - widthSize + "%";
    newBar.style.opacity = 0;
    newBar.style.transition = "opacity 500ms";
    newBar.style.transitionTimingFunction = "ease";
    newBar.setAttribute("data-height", num);

    mainCont.appendChild(newBar);
  }
  await sleep(500);
  for (let i = 0; i < children.length; i++) {
    findBar(i).style.opacity = 1;
    await sleep(1);
  }
}
//-------------- Main Sorting Functions --------------//
async function bubbleSort() { // Bubble Sort
	let children = Array.from(mainCont.children);
	
  var errors = 1;
  rounds = children.length;
  while (true) {
    errors = 0;
    for (let i = 0; i < children.length-1; i++) {
      if (i >= rounds) {
        continue;
      }
      var bar1 = findBar(i);
      var bar2 = findBar(i + 1);
      // beep
      bar1.style.backgroundColor = "#543196";
      bar2.style.backgroundColor = "#543196";
			await sleep(5);
      if (parseInt(bar1.getAttribute("data-height")) > parseInt(bar2.getAttribute("data-height"))) {
        let temp = [bar1.style.height, bar1.getAttribute("data-height")];
        bar1.style.height = bar2.style.height;
        bar2.style.height = temp[0];
        bar1.setAttribute("data-height", bar2.getAttribute("data-height"));
        bar2.setAttribute("data-height", temp[1]);

        errors += 1;
      }
      await sleep(5);
      bar1.style.backgroundColor = "#815bc8";
      bar2.style.backgroundColor = "#815bc8";
    }
    if (errors == 0) {
      break;
    }
    rounds -= 1;
  }
  for (let i = 0; i < children.length; i++) {
    findBar(i).style.backgroundColor = "green";
    // beep
    await sleep(10);
  }
  await sleep(1000);
  let buttons = document.getElementsByClassName("sortButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.animation = "buttonSlideIn 500ms ease-out"
  }
  startingCont.style.opacity = 1;
  startingCont.style.pointerEvents = "all";
}

async function selectionSort() { //Selection Sort
	let children = Array.from(mainCont.children);
	
  for (let i = 0; i < children.length; i++) {
    var smallestBar = [findBar(i), i];
    for (let x = 0; x < children.length; x++) {
      if (x <= i) {
        continue;
      }
      if (parseInt(findBar(x).getAttribute("data-height")) < parseInt(smallestBar[0].getAttribute("data-height"))) {
        smallestBar = [findBar(x), x];
      }
    }
    var bar1 = findBar(i);
    var bar2 = findBar(smallestBar[1]);
		bar1.style.backgroundColor = "#543196";
    bar2.style.backgroundColor = "#543196";
    await sleep(50);

    if (parseInt(smallestBar[0].getAttribute("data-height")) < parseInt(findBar(i).getAttribute("data-height"))) {
      let temp = [bar1.style.height, bar1.getAttribute("data-height")];
      bar1.style.height = bar2.style.height;
      bar1.setAttribute("data-height", bar2.getAttribute("data-height"));
      bar2.style.height = temp[0];
      bar2.setAttribute("data-height", temp[1]);
    }
		await sleep(50);
    bar1.style.backgroundColor = "#815bc8";
    bar2.style.backgroundColor = "#815bc8";
  }
  for (let i = 0; i < children.length; i++) {
    findBar(i).style.backgroundColor = "green";
    // beep
    await sleep(10);
  }
  await sleep(1000);
  let buttons = document.getElementsByClassName("sortButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.animation = "buttonSlideIn 500ms ease-out"
  }
  startingCont.style.opacity = 1;
  startingCont.style.pointerEvents = "all";
}

async function shellSort() { // Shell Sort
	let children = Array.from(mainCont.children);
	
  for (let gap = 25; gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < children.length; i += 1) {
      let temp = findBar(i);
      let tempDisplayHeight = temp.style.height;
      let tempHeight = parseInt(findBar(i).getAttribute("data-height"));

      let j;
      for (j = i; j >= gap && parseInt(findBar(j - gap).getAttribute("data-height")) > tempHeight; j -= gap) {
        findBar(j).style.backgroundColor = "#543196";
        await sleep(5);
				findBar(j).setAttribute("data-height", findBar(j - gap).getAttribute("data-height"));
        findBar(j).style.height = findBar(j - gap).style.height;
				await sleep(5);
        findBar(j).style.backgroundColor = "#815bc8";
      }
      temp.style.backgroundColor = "#543196";
      await sleep(5);
			findBar(j).setAttribute("data-height", tempHeight);
      findBar(j).style.height = tempDisplayHeight;
			await sleep(5);
      temp.style.backgroundColor = "#815bc8";
    }
  }
  for (let i = 0; i < children.length; i++) {
    findBar(i).style.backgroundColor = "green";
    // beep
    await sleep(10);
  }
  await sleep(1000);
  let buttons = document.getElementsByClassName("sortButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.animation = "buttonSlideIn 500ms ease-out"
  }
  startingCont.style.opacity = 1;
  startingCont.style.pointerEvents = "all";
}

async function mergeSort() {
  var children = Array.from(mainCont.children);
  await mergeSortFunc(0, children.length - 1);

	for (let i = 0; i < children.length; i++) {
    findBar(i).style.backgroundColor = "green";
    // beep
    await sleep(10);
  }
  await sleep(1000);
  let buttons = document.getElementsByClassName("sortButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.animation = "buttonSlideIn 500ms ease-out"
  }
  startingCont.style.opacity = 1;
  startingCont.style.pointerEvents = "all";
}

async function quickSort() {
	var children = Array.from(mainCont.children);
	await quickSortFunc(children, 0, children.length - 1);

	for (let i = 0; i < children.length; i++) {
    findBar(i).style.backgroundColor = "green";
    // beep
    await sleep(10);
  }
  await sleep(1000);
  let buttons = document.getElementsByClassName("sortButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.animation = "buttonSlideIn 500ms ease-out"
  }
  startingCont.style.opacity = 1;
  startingCont.style.pointerEvents = "all";
}
//-------------- Merge Sort Functions+ --------------//
async function merge(start, mid, end) {
  let start2 = mid + 1;

  // If the direct merge is already sorted
  if (parseInt(findBar(mid).getAttribute("data-height")) <= parseInt(findBar(start2).getAttribute("data-height"))) {
    return;
  }

  // Two pointers to maintain start of both arrays to merge
  while (start <= mid && start2 <= end) {
    // If element 1 is in right place
    if (parseInt(findBar(start).getAttribute("data-height")) <= parseInt(findBar(start2).getAttribute("data-height"))) {
      start++;
    }
    else {
			let valueDispHeight = findBar(start2).style.height;
			let valueActuHeight = findBar(start2).getAttribute("data-height");
      let index = start2;

      // Shift all the elements between element 1 & 2 right by 1.
      while (index != start) {
        findBar(index).style.height = findBar(index - 1).style.height;
        findBar(index).setAttribute("data-height", findBar(index - 1).getAttribute("data-height"));
				findBar(index).style.backgroundColor = "#543196";
	      await sleep(10);
	      findBar(index).style.backgroundColor = "#815bc8";

        index--;
      }
      findBar(start).style.height = valueDispHeight;
      findBar(start).setAttribute("data-height", valueActuHeight);
      findBar(start).style.backgroundColor = "#543196";
	    await sleep(10);
	    findBar(start).style.backgroundColor = "#815bc8";

      // Update all the pointers
      start++;
      mid++;
      start2++;
    }
  }
}
async function mergeSortFunc(l, r) {
  if (l < r) {
    // Same as (l + r) / 2, but avoids overflow for large l and r
    let m = l + Math.floor((r - l) / 2);

    // Sort first and second halves
    await mergeSortFunc(l, m);
    await mergeSortFunc(m + 1, r);

    await merge(l, m, r);
  }
}
//-------------- Quick Sort Functions+ --------------//
async function quickSortSwap(leftIndex, rightIndex){
	var tempDispHeight = findBar(leftIndex).style.height;
	var tempActuHeight = findBar(leftIndex).getAttribute("data-height");

	findBar(leftIndex).style.backgroundColor = "#543196";
	findBar(rightIndex).style.backgroundColor = "#543196";
	await sleep(50);
	
	findBar(leftIndex).style.height = findBar(rightIndex).style.height;
	findBar(leftIndex).setAttribute("data-height", findBar(rightIndex).getAttribute("data-height"));
	findBar(rightIndex).style.height = tempDispHeight;
	findBar(rightIndex).setAttribute("data-height", tempActuHeight);
	
	await sleep(50);
	findBar(leftIndex).style.backgroundColor = "#815bc8";
	findBar(rightIndex).style.backgroundColor = "#815bc8";
}
async function partition(left, right) {
	var pivot = findBar(Math.floor((right + left) / 2)); //middle element
	var pivotDispHeight = parseInt(pivot.getAttribute("data-height"));
	var i = left //left pointer
	var j = right; //right pointer
	while (i <= j) {
		while (parseInt(findBar(i).getAttribute("data-height")) < pivotDispHeight) {
			i++;
		}
		while (parseInt(findBar(j).getAttribute("data-height")) > pivotDispHeight) {
			j--;
		}
		if (i <= j) {
			await quickSortSwap(i, j); //sawpping two elements
			i++;
			j--;
		}
	}
	return i;
}
async function quickSortFunc(items, left, right) {
	var index;
	if (items.length > 1) {
		index = await partition(left, right); //index returned from partition
		if (left < index - 1) { //more elements on the left side of the pivot
			await quickSortFunc(items, left, index - 1);
		}
		if (index < right) { //more elements on the right side of the pivot
			await quickSortFunc(items, index, right);
		}
	}
	return items;
}