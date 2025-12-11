
// export async function GET(request: Request) {
// 	const a = await fetch("https://ltmobil.medley.no/");
// 	let b = await a.text()
// 	return Response.json({"data": b});
// }

export async function POST(request: Request) {
	const req = await request.json();
	const res = await fetch(req.url, req.header)
	const text = await res.text();
	return Response.json({text: text});
}