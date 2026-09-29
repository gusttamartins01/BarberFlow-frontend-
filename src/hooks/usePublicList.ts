import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

export function usePublicList<T>(path: string) {
	const [items, setItems] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const loadItems = useCallback(
		(signal?: AbortSignal) =>
			apiRequest<T[]>(path, { signal })
				.then((result) => {
					if (!signal?.aborted) {
						setItems(result);
						setError(false);
					}
				})
				.catch(() => {
					if (!signal?.aborted) setError(true);
				})
				.finally(() => {
					if (!signal?.aborted) setLoading(false);
				}),
		[path]
	);

	useEffect(() => {
		const controller = new AbortController();
		void loadItems(controller.signal);

		return () => controller.abort();
	}, [loadItems]);

	const retry = useCallback(() => {
		setError(false);
		setLoading(true);
		void loadItems();
	}, [loadItems]);

	return { items, loading, error, retry };
}
