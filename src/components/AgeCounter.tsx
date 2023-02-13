import { useEffect, useState } from "react";

const BIRTHDAY = new Date("2000-03-10").getTime();

const formatter = new Intl.NumberFormat("en-US", {
	style: "decimal",
	minimumFractionDigits: 8,
	maximumFractionDigits: 8,
});

const getAge = () => {
	const diff = new Date().getTime() - BIRTHDAY;
	return formatter.format(diff / 1000 / 60 / 60 / 24 / 365);
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
