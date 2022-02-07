export function getNotNullItems(items_dict)
{
	const items = {};
	Object.entries(items_dict)
		.filter(([, value]) => value !== 0)
		.forEach(([key, value]) => (items[key] = value));
	
	return items
}

//takes date obj or string in format 'yyyy-mm-dd' and returns string in format 'dd-mm-yyyy' + days
export function addDays(date_obj, days) { 
    let result = new Date(Number(date_obj));
  	result.setDate(result.getDate() + days);
    return (String(result.getDate()).padStart(2, '0'))+'-'+(String(result.getMonth()+1).padStart(2, '0'))+'-'+result.getFullYear();;
}