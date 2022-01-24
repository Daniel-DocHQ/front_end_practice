export function getNotNullItems(items_dict)
{
	const items = {};
	Object.entries(items_dict)
		.filter(([, value]) => value !== 0)
		.forEach(([key, value]) => (items[key] = value));
	
	return items
}
