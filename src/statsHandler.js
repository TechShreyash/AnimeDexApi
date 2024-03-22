const CACHE = {}


async function increaseViews(website) {
    try {
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