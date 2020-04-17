/* global localStorage */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import RSSParser from 'rss-parser'
import styles from './Feed.module.scss'

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

async function fetchHTTP (url, setFeed, title) {
  const { data } = await axios.get(url)
  localStorage.setItem(`feed:${title}`, JSON.stringify(data))
  setFeed(data)
}

const HTTPFeed = ({ url, title, type }) => {
  const cached = localStorage.getItem(`feed:${title}`)
  const [feed, setFeed] = useState(cached ? JSON.parse(cached) : {})
  useEffect(() => {
    if (type === 'rss') {
      fetchRSS(url, setFeed, title)
    }
    if (type === 'http') {
      fetchHTTP(url, setFeed, title)
    }
  }, [url])
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>#{title.toLowerCase()}</h2>
      {feed && Array.isArray(feed) && feed.map((item, i) => (
        <div key={item.url || i} className={styles.item}>
          <span className={styles.description}>{item.description}</span>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.heading}>
            {item.name}
          </a>
        </div>
      ))}
    </div>
  )
}

async function fetchRSS (url, setFeed, title) {
  const parser = new RSSParser()
  const feed = await parser.parseURL(CORS_PROXY + url)
  localStorage.setItem(`feed:${title}`, JSON.stringify(feed.items))
  setFeed(feed.items)
}

const RSSFeed = ({ url, title, type }) => {
  const cached = localStorage.getItem(`feed:${title}`)
  const [feed, setFeed] = useState(cached ? JSON.parse(cached) : {})
  useEffect(() => {
    if (type === 'rss') {
      fetchRSS(url, setFeed, title)
    }
    if (type === 'http') {
      fetchHTTP(url, setFeed, title)
    }
  }, [url])
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>#{title.toLowerCase()}</h2>
      {feed && Array.isArray(feed) && feed.map((item, i) => (
        <div key={item.id || item.link || i} className={styles.item}>
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </div>
      ))}
    </div>
  )
}

const Feed = props => props.type === 'rss' ? RSSFeed(props) : HTTPFeed(props)

export default Feed
