import axios from "axios";
import mongoose from "mongoose";
import { Country } from "./Country.js";

const months = {
	1: 31,
	2: 28,
	3: 31,
	4: 30,
	5: 31,
	6: 30,
	7: 31,
	8: 31,
	9: 30,
	10: 31,
	11: 30,
	12: 31
};

async function fetch(month, year) {
	const rs = await axios.get("https://disease.sh/v3/covid-19/historical?lastdays=all");
	const data = rs.data;
	// console.log(data);

	const countriesMap = new Map();
	const endDay = months[month];
	for (let day = 1; day <= endDay; day++) {
		for (let country of data) {
			const { country: countryName, timeline, province } = country;
			const { cases } = timeline;
			const dateQuery = `${month}/${day}/${year}`;
			let caseCount = cases[dateQuery];

			if (!countriesMap.has(countryName)) {
				// if (province && countryName === "China") {
				//   // console.log("first", caseCount);
				// }
				countriesMap.set(countryName, { [dateQuery]: caseCount });
			} else {
				// if (province && countryName === "China") {
				// console.log("Before ", caseCount);
				// caseCount += countriesMap.get(countryName)[dateQuery];
				// console.log("After ", caseCount);
				// console.log(countryName, caseCount, dateQuery);
				// console.log(countriesMap.get(countryName)[dateQuery]);
				let currentCaseCount = countriesMap.get(countryName)[dateQuery] ?? 0;
				// console.log("before\t", province, dateQuery, currentCaseCount ?? "No date", "caseCount : \t", caseCount, "currentCaseCount : \t", currentCaseCount, "sum : \t", caseCount);
				caseCount += currentCaseCount;
				// console.log("after\t", province, dateQuery, currentCaseCount ?? "No date", "caseCount : \t", caseCount, "currentCaseCount : \t", currentCaseCount, "sum : \t", caseCount);
				// }
				// console.log(caseCount);
				countriesMap.set(countryName, { ...countriesMap.get(countryName), [dateQuery]: caseCount });
			}
		}
		// console.log();
	}
	// console.log(countriesMap);
	// console.log(countriesMap.get("China"));
	return countriesMap;
}

async function storeToDatabase() {
	try {
		await mongoose.connect("mongodb+srv://@jason.gyhm9f9.mongodb.net/?retryWrites=true&w=majority", {dbName: "jobs_assignment"});
		// console.log("Connection successfully");
		// const ct = new Country({
		//   name: "USA",
		//   cases: new Map([
		//     ["4/1/20", 197],
		//     ["4/2/20", 223],
		//     ["4/3/20", 444],
		//     ["4/4/20", 966],
		//     ["4/5/20", 1142],
		//     ["4/6/20", 1142],
		//     ["4/7/20", 1142],
		//   ])
		// });
		// const rs = await ct.save();
		// console.log(rs);

		// console.log(new Date("2020-04-01"));
		// const countries = [];
		// console.log(data.get("China"));

	} catch (err) {
		console.error(err);
	}

	const data = await fetch(12, 21);
	for (let [key, value] of data.entries()) {
		console.log(key, value);
		// data.get(key)
		const newCountry = new Country({name: key, cases: value});
		const rs = await newCountry.save();
		console.log(rs);
	}
	// console.log(data);
	mongoose.disconnect();
}

storeToDatabase();
