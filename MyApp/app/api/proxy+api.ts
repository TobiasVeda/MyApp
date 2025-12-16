

export async function POST(request: Request) {
	const req = await request.json();
	const res = await fetch(req.url, req.header)

	const arrayBuffer = await res.arrayBuffer();
	const decoder = new TextDecoder(req.encoding);
	const text = decoder.decode(arrayBuffer);

	return Response.json({text: text});
}