/* global localStorage */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './Feed.module.scss'

const CORS_PROXY = 'https://cors.ceuk.dev/?url='

async function fetchFeed (url, setFeed, title) {
  const { data: { data: { children } } } = await axios.get(url)
  const data = children.map(({ data }) => data)
  localStorage.setItem(`feed:${title}`, JSON.stringify(data))
  setFeed(data)
}

const Reddit = ({ url, title }) => {
  const cached = localStorage.getItem(`feed:${title}`)
  const [feed, setFeed] = useState(cached ? JSON.parse(cached) : {})
  useEffect(() => {
    fetchFeed(CORS_PROXY + url, setFeed, title)
  }, [url])
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>#{title.toLowerCase()}</h2>
      {feed && Array.isArray(feed) && feed.map((item, i) => (
        <div key={item.url || i} className={styles.item}>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.meta}>/r/{item.subreddit}</span>
            <span className={styles.heading}>
              {item.title}
            </span>
          </a>
          {item.selftext
            ? <span className={styles.description}>{item.selftext.substr(0, 100) + '...'}</span>
            : (item.url.match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)
              ? <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.link}><img src={item.url} className={styles.image}/></a>
              : (item.thumbnail && item.thumbnail !== 'self' && item.thumbnail !== 'default'
                ? <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.link}><img src={item.thumbnail} className={styles.image}/></a>
                : <span className={styles.description}>{item.domain}</span>
              )
            )
          }
          <a href={`https://old.reddit.com${item.permalink}`} target="_blank" rel="noopener noreferrer" className={styles.description}>	💬 {item.num_comments}</a>
        </div>
      ))}
    </div>
  )
}

export default Reddit
