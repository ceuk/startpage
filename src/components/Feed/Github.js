/* global localStorage */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './Feed.module.scss'

async function fetchFeed (url, setFeed, title) {
  const { data } = await axios.get(url)
  localStorage.setItem(`feed:${title}`, JSON.stringify(data))
  setFeed(data)
}

const Github = ({ url, title }) => {
  const cached = localStorage.getItem(`feed:${title}`)
  const [feed, setFeed] = useState(cached ? JSON.parse(cached) : {})
  useEffect(() => {
    fetchFeed(url, setFeed, title)
  }, [url])
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>#{title.toLowerCase()}</h2>
      {feed && Array.isArray(feed) && feed.map((item, i) => (
        <div key={item.url || i} className={styles.item}>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.meta}>★{item.stars}</span>
            <span className={styles.heading}>
              {item.name}
            </span>
          </a>
          <span className={styles.description}>{item.description}</span>
        </div>
      ))}
    </div>
  )
}

export default Github
