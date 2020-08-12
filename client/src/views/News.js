import React, {useState, useEffect} from "react";

const News = () => {
    const [articles, setArticles] = useState([]);
    localStorage.removeItem("map_location");
    //Fetches data from News API after the page is rendered
    const proxyUrl = "https://cors-anywhere.herokuapp.com/"
    useEffect(() => {
        //Currently fetching top-headlines in english with the keyword protest
        fetch(`${proxyUrl}https://gnews.io/api/v2/?q=protest&token=8d4de90a0c4ae440463b46186441f013`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //Store fetched data into an array and set state
            let tmpArray = [];
            for (var i = 0; i < data.articles.length; i++) {
                tmpArray.push(data.articles[i]);
            }
            setArticles(tmpArray);
        });
    }, []);

    //For debugging purposes
    console.log(articles);

    //If articles have been fetched, display them; Otherwise, return an empty div
    if (articles && articles.length > 0) {
        const articlesArr = articles.map(article => 
            <div class="row mx-auto newsarticle"  onClick={(event) => {event.preventDefault(); window.open(`${article.website}`);}}>
                <div class="col my-auto">
                    <div class="spacer"></div>
                    <div class="spacer"></div>
                    <h4>{article.title}</h4>
                    <h2 class="author_date">{article.source} - {article.date}</h2>
                    <p class="description">{article.description}</p>
                </div>
            </div>
        );
        return (
            <div>
                <div class="spacer"></div>
                <div class="spacer"></div>
                <div class="row"><h2 class="mx-auto protestlabel">Recent News</h2></div>
                <div>{articlesArr}</div>
            </div>
        );
    }
    else {
        return (
            <div></div>
        );
    }
};

export default News;