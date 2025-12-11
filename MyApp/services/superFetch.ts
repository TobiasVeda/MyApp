
// Should never run on refresh. Path becomes incorrect when rendered with Node SSR
export async function superFetch(url:string, header:any = {method: "GET"}):Promise<string>{
    const res = await fetch("/api/proxy", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({url: url, header: header})
    });
    const json = await res.json();
    return json.text.toString();
}