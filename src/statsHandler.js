const CACHE = {}


async function increaseViews(headers) {
    try {
        let referer = String(headers.get("Referer"));
        if (referer == 'null') {
            referer = String(headers.get("referer"));
        }
        if (referer == 'null') {
            referer = "direct";
        }
        else {
            try {
                const url = new URL(referer);
                referer = url.origin
            }
            catch (e) {
                console.log(e)
            }
        }
        const website = referer
        console.log(website)

        if (CACHE[website]) {
            CACHE[website] += 1
        } else {
            CACHE[website] = 1
        }

        if (CACHE[website] < 10) {
            return
        }

        const url = 'https://statsapi-production-871f.up.railway.app/increaseViews'
        await fetch(url, { headers: { 'Referer': website } })

        CACHE[website] = 0
    } catch (e) {
        console.log(e)
    }
}

export { increaseViews }