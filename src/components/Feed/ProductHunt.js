/* global localStorage */
import React, { useEffect, useState } from 'react'
import RSSParser from 'rss-parser'
import styles from './Feed.module.scss'

const CORS_PROXY = 'https://cors.ceuk.dev/?url='

async function fetchRSS (url, setFeed, title) {
  const parser = new RSSParser()
  const feed = await parser.parseURL(CORS_PROXY + url)
  localStorage.setItem(`feed:${title}`, JSON.stringify(feed.items))
  setFeed(feed.items)
}

const ProductHunt = ({ url, title }) => {
  const cached = localStorage.getItem(`feed:${title}`)
  const [feed, setFeed] = useState(cached ? JSON.parse(cached) : {})
  useEffect(() => {
    fetchRSS(url, setFeed, title)
  }, [url])
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>#{title.toLowerCase()}</h2>
      {feed && Array.isArray(feed) && feed.map((item, i) => (
        <div key={item.id || item.link || i} className={styles.item}>
          <a href={item.content.match(/(href=")(.*)(">Link)/)[2]} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.heading}>
              {item.title}
            </span>
          </a>
          <span className={styles.description}>{truncate(item.contentSnippet.replace(/Discussion\n {8}\|\n {8}Link/, '').substr(2), 100, '…')}</span>
        </div>
      ))}
    </div>
  )
}

function truncate (str, len, append) {
  var newLength
  append = append || ''
  if (str.indexOf(' ') + append.length > len) {
    return str
  }
  str.length + append.length > len ? newLength = len - append.length : newLength = str.length
  var tempString = str.substring(0, newLength)
  tempString = tempString.replace(/\s+\S*$/, '')
  if (str.length > len && append.length > 0) {
    tempString = tempString + append
  }
  return tempString || 'No description'
}

export default ProductHunt
