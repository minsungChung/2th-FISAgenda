import { getLabel } from '../js/calendarLabel.js';

const SUNDAY = 0;
const SATURDAY = 6;
const NUMBER_OF_DAYS_OF_WEEK = 7;

const tbody = document.getElementsByTagName('tbody').item(0);

function getFirstDayOfMonth(year, monthIdx) {
	return new Date(year, monthIdx, 1).getDay();
}

function getLastDayOfMonth(year, monthIdx) {
	return new Date(year, monthIdx + 1, 0).getDay();
}

function getLastDateOfMonth(year, monthIdx) {
	return new Date(year, monthIdx + 1, 0).getDate();
}

function createDateElement(date, day, labels = []) {
	const td = document.createElement('td');
	td.classList = ['table-border'];
	const wrapDiv = document.createElement('div');
	wrapDiv.classList = ['content-top'];

	const dateDiv = document.createElement('div');
	dateDiv.classList = ['text-xl, font-bold'];

	const label = document.createElement('div');
	label.classList = [`h-2/3 label-container`];

	// label 안에 요소 추가
	if (labels.length !== 0) {
		labels.forEach((v) => {
			label.innerHTML = `
	  <div class='${v[1]}'><p>${v[0]}</p></div>
	  `;
		});
	}

	if (day === SUNDAY) {
		dateDiv.classList.add('text-red-800');
	}
	if (day === SATURDAY) {
		dateDiv.classList.add('text-blue-800');
	}
	dateDiv.textContent = date;

	wrapDiv.appendChild(dateDiv);
	td.appendChild(wrapDiv);
	td.appendChild(label);
	return td;
}

function createPrefix(year, monthIdx) {
	const firstDay = getFirstDayOfMonth(year, monthIdx);
	const pastMonthLastDate = getLastDateOfMonth(year, monthIdx - 1);
	const tr = document.createElement('tr');

	tbody.appendChild(tr);
	for (let i = 0; i < firstDay; i += 1) {
		const date = pastMonthLastDate - (firstDay - i - 1);
		const day = new Date(year, monthIdx - 1, date).getDay();
		const el = createDateElement(date, day);
		el.classList.add('bg-gray-200');
		el.classList.add('opacity-30');
		tr.appendChild(el);
	}
}

function createSuffix(year, monthIdx) {
	const lastDay = getLastDayOfMonth(year, monthIdx);
	const tr = tbody.lastElementChild;

	for (let i = 1; i <= 6 - lastDay; i += 1) {
		const day = new Date(year, monthIdx + 1, i).getDay();
		const el = createDateElement(i, day);
		el.classList.add('bg-gray-200');
		el.classList.add('opacity-30');
		tr.appendChild(el);
	}
}

export default async function createCalendar(year, monthIdx) {
	tbody.replaceChildren();
	const firstDay = getFirstDayOfMonth(year, monthIdx);
	const lastDay = getLastDayOfMonth(year, monthIdx);
	const lastDate = getLastDateOfMonth(year, monthIdx);

	if (firstDay) {
		createPrefix(year, monthIdx);
	}

	let tr = tbody.firstElementChild ?? document.createElement('tr');

	for (let i = 1; i <= lastDate; i += 1) {
		// 라벨 찾고,
		const date = new Date(year, monthIdx, i);

		const label = await getLabel(date)
		console.log(label);
		// console.log(label.length);
		if (!(tr.childElementCount % NUMBER_OF_DAYS_OF_WEEK)) {
			tr = document.createElement('tr');
			tbody.appendChild(tr);
		}
		const day = new Date(year, monthIdx, i).getDay();
		const el = createDateElement(i, day, label);
		tr.appendChild(el);
	}

	if (lastDay !== SATURDAY) {
		createSuffix(year, monthIdx);
	}
}

// createCalendar(2023, 6);
