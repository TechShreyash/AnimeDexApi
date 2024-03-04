function anilistSearchQuery(query, page, perPage = 10, type = "ANIME") {
    return `query ($page: Int = ${page}, $id: Int, $type: MediaType = ${type}, $search: String = "${query}", $isAdult: Boolean = false, $size: Int = ${perPage}) { Page(page: $page, perPage: $size) { pageInfo { total perPage currentPage lastPage hasNextPage } media(id: $id, type: $type, search: $search, isAdult: $isAdult) { id status(version: 2) title { userPreferred romaji english native } bannerImage popularity coverImage{ extraLarge large medium color } episodes format season description seasonYear averageScore genres  } } }`;
}

function anilistTrendingQuery(page = 1, perPage = 10, type = "ANIME") {
    return `query ($page: Int = ${page}, $id: Int, $type: MediaType = ${type}, $isAdult: Boolean = false, $size: Int = ${perPage}, $sort: [MediaSort] = [TRENDING_DESC, POPULARITY_DESC]) { Page(page: $page, perPage: $size) { pageInfo { total perPage currentPage lastPage hasNextPage } media(id: $id, type: $type, isAdult: $isAdult, sort: $sort) { id status(version: 2) title { userPreferred romaji english native } genres description format bannerImage coverImage{ extraLarge large medium color } episodes meanScore season seasonYear averageScore } } }`;
}

function anilistMediaDetailQuery(id) {
    return `query ($id: Int = ${id}) { Media(id: $id) { id title { english native romaji userPreferred } coverImage { extraLarge large color } bannerImage season seasonYear description type format status(version: 2) episodes genres averageScore popularity meanScore recommendations { edges { node { id mediaRecommendation { id meanScore title { romaji english native userPreferred } status episodes coverImage { extraLarge large medium color } bannerImage format } } } } } }`;
}

function  anilistUpcomingQuery(page){
  const perPage=20
  const notYetAired=true

  return `query { Page(page: ${page}, perPage: ${perPage}) { pageInfo { total perPage currentPage lastPage hasNextPage } airingSchedules( notYetAired: ${notYetAired}) { airingAt episode media { id description idMal title { romaji english userPreferred native } countryOfOrigin description popularity bannerImage coverImage { extraLarge large medium color } genres averageScore seasonYear format } } } }`;

}
async function getAnilistTrending() {
    const url = "https://graphql.anilist.co";
    const query = anilistTrendingQuery();
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: query,
        }),
    };
    const res = await fetch(url, options);
    let data = await res.json();
    data = {
        results: data["data"]["Page"]["media"],
    };
    return data;
}

async function getAnilistUpcoming(page) {
    const url = "https://graphql.anilist.co";
    const query = anilistUpcomingQuery(page);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: query,
        }),
    };
    const res = await fetch(url, options);
    let data = await res.json();
    data = {
        results: data["data"]["Page"]["airingSchedules"],
    };
    return data;
}

async function getAnilistSearch(query) {
    const url = "https://graphql.anilist.co";
    query = anilistSearchQuery(query, 1, 1);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: query,
        }),
    };
    const res = await fetch(url, options);
    let data = await res.json();
    data = {
        results: data["data"]["Page"]["media"],
    };
    return data;
}

async function getAnilistAnime(id) {
    const url = "https://graphql.anilist.co";
    console.log(id);
    const query = anilistMediaDetailQuery(id);
    console.log(query);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: query,
        }),
    };
    const res = await fetch(url, options);
    let data = await res.json();
    let results = data["data"]["Media"];
    results["recommendations"] = results["recommendations"]["edges"];

    for (let i = 0; i < results["recommendations"].length; i++) {
        const rec = results["recommendations"][i];
        results["recommendations"][i] = rec["node"]["mediaRecommendation"];
    }
    return results;
}

export { getAnilistTrending, getAnilistSearch, getAnilistAnime ,getAnilistUpcoming};
