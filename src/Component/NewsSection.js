import React, { useState, useEffect } from 'react'
import News from './News';
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

function NewsSection(props) {
    const [articles, setArticles] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalResults, setTotalResults] = useState(0)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

        const updateNews = async ()=> {
         props.setProgress(10);
         const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`; 
         setLoading(true)
         let data = await fetch(url);
         props.setProgress(30);
         let parsedData = await data.json()
         props.setProgress(70);
         setArticles(parsedData.articles)
         setTotalResults(parsedData.totalResults)
         setLoading(false)
         props.setProgress(100);
     }

     const fetchMoreData = async () => {   
         const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
         setPage(page+1) 
         let data = await fetch(url);
         let parsedData = await data.json()
         setArticles(articles.concat(parsedData.articles))
         setTotalResults(parsedData.totalResults)
       };

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsHub`;
        updateNews();
        setLoading(true);
        // eslint-disable-next-line
    }, [])


    return (
        <div className={`${props.mode === 'dark' ? 'bg-[#1F1D36] text-white' : 'bg-[#FDEFEF] text-black'} pt-20 md:pt-24  w-full min-h-screen pb-6`}>
            <div className={`pt-4 text-center text-3xl md:text-6xl font-bold ${props.mode === 'dark' ? 'text-amber-400' : 'text-red-600'}`}>
                <span className='mb-4'>NewsHub </span>
                <span className={`${props.mode === 'dark' ? 'text-red-400' : ' text-blue-700'}`}>{capitalizeFirstLetter(props.category)}</span>
            </div>
            {loading && <Spinner />}

            <InfiniteScroll dataLength={articles.length} next={fetchMoreData} hasMore={articles.length !== totalResults} loader={<Spinner />}>
            <div className='pt-6 flex gap-12 flex-wrap justify-center mt-6 mb-8'>
                {!loading && articles.map((element) => {
                    return <News key={element.url} mode={`${props.mode}`} title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} url={element.url} source={element.source.name} author={element.author} date={element.publishedAt} />
                })}
            </div>
            <div className={`${props.mode === 'dark' ? 'bg-[#1A1A2E] border-t border-gray-600' : 'bg-[#FFF8F3] border-t border-red-200'} text-${props.mode === 'dark' ? 'white' : 'black'} w-full fixed bottom-0 text-center p-2 mt-6 font-serif text-xs md:text-sm`}>
                <span>Copyright &#169;2023 NewsHub all rights reserved on behalf of @John Joeshua</span>
                <div className='hidden md:inline-block float-right mr-16 space-x-4'>
                </div>
            </div>
            </InfiniteScroll>
        </div>
    )
}

NewsSection.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}

NewsSection.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}
export default NewsSection;