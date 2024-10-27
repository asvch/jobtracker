import { useEffect, useState } from 'react';

// Custom hook for debouncing any value
const useDebouncedValue = <T>(value: T, delay: number): T => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup the timeout if value changes before the delay completes
		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
};

export default useDebouncedValue;
