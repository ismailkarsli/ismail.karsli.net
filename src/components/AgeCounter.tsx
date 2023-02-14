import { useEffect, useState } from "react";

const BIRTHDAY = new Date("2000-03-10").getTime();
const ONE_DAY = 1000 * 60 * 60 * 24;

const formatter = new Intl.NumberFormat("en-US", {
	style: "decimal",
	minimumFractionDigits: 8,
	maximumFractionDigits: 8,
});

const getAge = () => {
	const diff = new Date().getTime() - BIRTHDAY;
	const diffDays = diff / ONE_DAY;
	const leapDays = Math.floor(diffDays / 365 / 4);
	return formatter.format((diffDays - leapDays) / 365);
};

export default function AgeCounter() {
	const [age, setAge] = useState<string | undefined>();
	useEffect(() => {
		const interval = setInterval(() => {
			setAge(getAge());
		}, 100);
		return () => clearInterval(interval);
	}, []);

	return <>{age}</>;
}
